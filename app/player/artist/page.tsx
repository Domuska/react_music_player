"use client";

import styled from "styled-components";
import { SpotifyAPi } from "../../../components/Spotify/SpotifyApi";
import { useSuspenseQueries } from "@tanstack/react-query";
import { TracksList } from "../../../components/TracksList/TracksList";
import { HorizontalItemContainer } from "../../../components/HorizontalItemContainer";
import { PlayPauseButton } from "../../../components/Buttons/PlayPauseButton";
import { ClickableTitle } from "../../../components/ClickableTitle";

import { useRouter, useSearchParams } from "next/navigation";
import { useContext } from "react";
import { CurrentPlaybackContext, SpotifyApiContext } from "../context";
import invariant from "tiny-invariant";
import { StickyHeadingRow } from "../../../components/StickyHeadingRow";

export default () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const artistId = searchParams?.get("artistId");
  const { spotifyApiRef } = useContext<{
    spotifyApiRef: SpotifyAPi;
  }>(SpotifyApiContext);
  const currentPlaybackStatus = useContext(CurrentPlaybackContext);

  invariant(artistId, "artist id is required");

  const fetchArtist = {
    queryKey: ["artist", artistId, spotifyApiRef],
    queryFn: async () => {
      if (!spotifyApiRef) {
        return null;
      }
      const result = await spotifyApiRef.fetchArtist(artistId);
      return result;
    },
  };

  const fetchTopTracks = {
    queryKey: ["artist-top-tracks", artistId, spotifyApiRef],
    queryFn: async () => {
      if (!spotifyApiRef) {
        return [];
      }
      const result = await spotifyApiRef.fetchArtistTopTracks(artistId);
      return result;
    },
  };

  const fetchAlbums = {
    queryKey: ["artist-albums", artistId, spotifyApiRef],
    queryFn: async () => {
      if (!spotifyApiRef) {
        return [];
      }
      const result = await spotifyApiRef.fetchArtistAlbums(artistId);
      return result;
    },
  };

  const fetchRelatedArtists = {
    queryKey: ["artist-related-artists", artistId, spotifyApiRef],
    queryFn: async () => {
      if (!spotifyApiRef) {
        return [];
      }
      const result = await spotifyApiRef.fetchArtistRelatedArtists(artistId);
      return result;
    },
  };

  const [artistResult, topTracksResult, albumsResult, relatedArtistsResult] =
    useSuspenseQueries({
      queries: [fetchArtist, fetchTopTracks, fetchAlbums, fetchRelatedArtists],
    });

  const { data: artist } = artistResult;
  const { data: topTracks } = topTracksResult;
  const { data: albums } = albumsResult;
  const { data: relatedArtists } = relatedArtistsResult;

  // might still be null if parent layout has not set up spotify API yet
  if (!artist) {
    return null;
  }

  const context = currentPlaybackStatus?.context;
  const currentlyPlayingItem = currentPlaybackStatus?.item;
  const isPlaying = currentPlaybackStatus?.is_playing;

  // take the largest image
  const imgSrc = artist?.images[0]?.url ?? "";

  const playTrack = (trackUri: string) => {
    // we should pass in artist.uri as context, but the API doesn't support it :/
    return spotifyApiRef.playPlayback({
      offset: trackUri,
    });
  };

  const onPlayAlbum = (albumUri: string) => {
    spotifyApiRef.playPlayback({ context_uri: albumUri });
  };

  const onPlayArtist = (artistUri: string) => {
    spotifyApiRef.playPlayback({ context_uri: artistUri });
  };

  const onPlayPause = () => {
    if (isPlaying) {
      spotifyApiRef.pausePlayback();
    } else {
      spotifyApiRef.playPlayback();
    }
  };

  const onOpenAlbum = (id: string) => {
    const queryParams = new URLSearchParams({
      albumId: id,
    });
    router.push("/player/album?" + queryParams.toString());
  };

  const onOpenArtist = (id: string) => {
    const queryParams = new URLSearchParams({
      artistId: id,
    });
    router.push("/player/artist?" + queryParams.toString());
  };

  // todo for the top songs:
  // todo remove the individual play buttons, make the row open the album

  return (
    <>
      <HeadingContainer>
        {imgSrc ? <Img src={imgSrc} /> : null}

        <ArtistName>{artist.name}</ArtistName>

        <HeadingPlayButton
          onClick={() => onPlayArtist(artist.uri)}
          isPaused={!isPlaying}
          size="48px"
          colorVariant="mainAction"
        />
      </HeadingContainer>

      <HiddenStickyRowOnSmallScreen
        artistName={artist.name}
        onPlay={() => onPlayArtist(artist.uri)}
        isPaused={!isPlaying}
      />

      <ContentContainer>
        <div>
          <ClickableTitle text="Popular" />
          <TracksList
            displayMode="album"
            isPlaybackPaused={!isPlaying}
            currentlyPlayingTrackId={currentlyPlayingItem?.id}
            onPlayPause={onPlayPause}
            playTrack={playTrack}
            tracks={topTracks}
            isTracksListInPlaybackContext={context?.uri === artist.uri}
          />
        </div>

        <HorizontalItemContainer
          items={albums.map((album) => {
            return {
              ...album,
              onClick: () => onOpenAlbum(album.id),
              PlayButton: () => (
                <PlayPauseButton
                  isPaused={true}
                  onClick={() => onPlayAlbum(album.uri)}
                  colorVariant="mainAction"
                  size="48px"
                />
              ),
            };
          })}
          variant="square"
          title={{ text: "Discography", onClick: () => {} }}
        />

        <HorizontalItemContainer
          items={relatedArtists.map((artist) => {
            return {
              ...artist,
              onClick: () => onOpenArtist(artist.id),
              PlayButton: () => (
                <PlayPauseButton
                  isPaused={true}
                  onClick={() => onPlayArtist(artist.uri)}
                  colorVariant="mainAction"
                  size="48px"
                />
              ),
            };
          })}
          variant="round"
          title={{ text: "Similar artists", onClick: () => {} }}
        />
      </ContentContainer>
    </>
  );
};

const ContentContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 50px;
`;

const ArtistName = styled.h1`
  color: ${(props) => props.theme.colors.textOnMainBg};
  font-size: xxx-large;
`;

const HeadingContainer = styled.div`
  padding: 20px;
  display: flex;
  gap: 30px;
  align-items: center;

  animation-timeline: scroll();
  animation-name: fadeout;

  @keyframes fadeout {
    0% {
      opacity: 1;
    }
    60%,
    100% {
      opacity: 0;
    }
  }
`;

const Img = styled.img`
  width: 160px;
  height: 160px;
  border-radius: 100%;
`;

const HiddenStickyRowOnSmallScreen = styled(StickyHeadingRow)`
  @media screen and (max-width: 1200px) {
    display: none;
  }
`;

const HeadingPlayButton = styled(PlayPauseButton)`
  @media screen and (min-width: 1200px) {
    display: none;
  }
`;
