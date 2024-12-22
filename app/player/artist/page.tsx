"use client";

import { useQueries } from "@tanstack/react-query";
import styled from "styled-components";
import invariant from "tiny-invariant";
import { PlayPauseButton } from "../../../components/Buttons/PlayPauseButton";
import { ClickableTitle } from "../../../components/ClickableTitle";
import { HorizontalItemContainer } from "../../../components/HorizontalItemContainer";
import { SpotifyAPi } from "../../../components/Spotify/SpotifyApi";
import { TracksList } from "../../../components/TracksList/TracksList";

import { useRouter, useSearchParams } from "next/navigation";
import { useContext } from "react";
import { CurrentPlaybackContext, SpotifyApiContext } from "../context";

import { StickyHeadingRow } from "../../../components/StickyHeadingRow";
import { Spinner } from "../../../components/Spinner";

const FailedToLoadResult = ({ error }: { error: string }) => {
  const ErrorText = styled.p`
    color: ${(props) => props.theme.colors.textOnMainBg};
  `;
  return <ErrorText>{error}</ErrorText>;
};

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
        throw Error("No spotify API client");
      }
      const result = await spotifyApiRef.fetchArtist(artistId);
      if (!result.success) {
        throw Error(result.error);
      }
      return result.data;
    },
  };

  const fetchTopTracks = {
    queryKey: ["artist-top-tracks", artistId, spotifyApiRef],
    queryFn: async () => {
      if (!spotifyApiRef) {
        throw Error("No spotify API client");
      }
      const result = await spotifyApiRef.fetchArtistTopTracks(artistId);
      if (!result.success) {
        throw Error(result.error);
      }
      return result.data;
    },
  };

  const fetchAlbums = {
    queryKey: ["artist-albums", artistId, spotifyApiRef],
    queryFn: async () => {
      if (!spotifyApiRef) {
        throw Error("No spotify API client");
      }
      const result = await spotifyApiRef.fetchArtistAlbums(artistId);
      if (!result.success) {
        throw Error(result.error);
      }
      return result.data;
    },
  };

  const fetchRelatedArtists = {
    queryKey: ["artist-related-artists", artistId, spotifyApiRef],
    queryFn: async () => {
      if (!spotifyApiRef) {
        throw Error("No spotify API client");
      }
      const result = await spotifyApiRef.fetchArtistRelatedArtists(artistId);
      if (!result.success) {
        throw Error(result.error);
      }
      return result.data;
    },
  };

  const [artistResult, topTracksResult, albumsResult, relatedArtistsResult] =
    useQueries({
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
    // we should pass in artist.uri as context along wit thsi track
    // but the API doesn't support them together :/
    return spotifyApiRef.playPlayback({
      offset: trackUri,
    });
  };

  const onPlayAlbum = (albumUri: string) => {
    spotifyApiRef.playPlayback({ context_uri: albumUri });
  };

  const onPlayPause = (artistUri?: string) => {
    if (isPlaying) {
      spotifyApiRef.pausePlayback();
    } else if (artistUri) {
      spotifyApiRef.playPlayback({ context_uri: artistUri });
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
          onClick={() => onPlayPause(artist.uri)}
          isPaused={!isPlaying}
          size="48px"
          colorVariant="mainAction"
        />
      </HeadingContainer>

      <HiddenStickyRowOnSmallScreen
        artistName={artist.name}
        onPlay={() => onPlayPause(artist.uri)}
        isPaused={!isPlaying}
      />

      <ContentContainer>
        {topTracksResult.isFetching && <Spinner />}
        {topTracksResult.isError && (
          <FailedToLoadResult error="Failed to load top tracks" />
        )}
        {topTracks && (
          <PopularTracksContainer>
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
          </PopularTracksContainer>
        )}

        {albumsResult.isFetching && <Spinner />}
        {albumsResult.isError && (
          <FailedToLoadResult error="Failed to load albums" />
        )}
        {albums && (
          <HorizontalItemContainer
            items={albums.map((album) => {
              const image = album.images?.[0];
              return {
                ...album,
                image,
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
        )}

        {relatedArtistsResult.isFetching && <Spinner />}
        {relatedArtistsResult.isError && (
          <FailedToLoadResult error="Failed to load related artists" />
        )}

        {relatedArtists && (
          <HorizontalItemContainer
            items={relatedArtists.map((artist) => {
              const image = artist.images?.[0];
              return {
                ...artist,
                image,
                onClick: () => onOpenArtist(artist.id),
                PlayButton: () => (
                  <PlayPauseButton
                    isPaused={true}
                    onClick={() => onPlayPause(artist.uri)}
                    colorVariant="mainAction"
                    size="48px"
                  />
                ),
              };
            })}
            variant="round"
            title={{ text: "Similar artists", onClick: () => {} }}
          />
        )}
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
  font: x-large;
  /* small screen size needs padding as text is on its' own row */
  margin: 0 20px;

  @media screen and (min-width: 600px) {
    font-size: xxx-large;
    padding: 0;
  }
`;

const HeadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;

  animation-timeline: scroll();
  animation-name: fadeout;

  @media screen and (min-width: 600px) {
    flex-direction: row;
    gap: 30px;
    padding: 20px;
    align-items: center;
  }

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
  width: 100%;

  @media screen and (min-width: 600px) {
    width: 160px;
    height: 160px;
    border-radius: 100%;
  }
`;

const HiddenStickyRowOnSmallScreen = styled(StickyHeadingRow)`
  @media screen and (max-width: 1200px) {
    display: none;
  }
`;

const HeadingPlayButton = styled(PlayPauseButton)`
  margin: 0 20px;
  @media screen and (min-width: 1200px) {
    display: none;
  }
`;

const PopularTracksContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.tokens.marginL};
`;
