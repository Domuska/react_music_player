"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { TracksList } from "../../../components/TracksList/TracksList";
import { CurrentPlaybackContext, SpotifyApiContext } from "../context";
import { useContext, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import invariant from "tiny-invariant";
import { SpotifyAPi } from "../../../components/Spotify/SpotifyApi";
import styled from "styled-components";

import { Album } from "../../../components/types";
import Link from "next/link";

const MinutesToHoursAndMinutes = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const leftoverMinutes = minutes - 60 * hours;
  return { h: hours, m: leftoverMinutes };
};

const getAlbumInfoText = (album: Album | null) => {
  if (!album) {
    return "";
  }

  const [releaseYear] = album.release_date.split("-") ?? "unknown";

  const albumLengthMinutes = album.tracks.items.reduce(
    (previousVal, currentVal) => {
      const asMinutes = currentVal.duration_ms / 60000;
      return previousVal + asMinutes;
    },
    0
  );
  const roundedMinutes = Math.floor(albumLengthMinutes);
  const { h, m } = MinutesToHoursAndMinutes(roundedMinutes);

  return ` ${releaseYear} • ${album.total_tracks} tracks • ${h}h ${m}min`;
};

export default () => {
  const searchParams = useSearchParams();
  const albumId = searchParams?.get("albumId");
  const { spotifyApiRef } = useContext<{
    spotifyApiRef: SpotifyAPi;
  }>(SpotifyApiContext);
  const currentPlaybackStatus = useContext(CurrentPlaybackContext);

  invariant(albumId, "Album id is required");

  const { data: albumData } = useSuspenseQuery({
    queryKey: ["albumData", albumId, spotifyApiRef],
    queryFn: async () => {
      if (!spotifyApiRef) {
        return null;
      }
      const result = await spotifyApiRef.fetchAlbum(albumId);
      return result;
    },
  });

  const albumInfo = useMemo(() => getAlbumInfoText(albumData), [albumData]);

  if (!albumData) {
    return null;
  }

  const playTrack = (trackUri: string) => {
    return spotifyApiRef.playPlayback({
      context_uri: albumData.uri,
      offset: trackUri,
    });
  };

  const currentlyPlayingTrackId = currentPlaybackStatus?.item.id;
  const isPlaying = currentPlaybackStatus?.is_playing;
  const currentlyPlayingContextUri = currentPlaybackStatus?.context?.uri;

  const onPlayPause = () => {
    if (isPlaying) {
      spotifyApiRef.pausePlayback();
    } else {
      spotifyApiRef.playPlayback();
    }
  };

  return (
    <Container>
      <TitleArea>
        <Img
          src={albumData.images?.[0].url}
          alt={`art of album ${albumData.name}`}
        />
        <AlbumInfoContainer>
          <H1>{albumData.name}</H1>
          <div>
            {albumData.artists.map((artist) => {
              const href = {
                pathname: "/player/artist",
                query: { artistId: artist.id },
              };
              return (
                <Link href={href} key={artist.id}>
                  {" "}
                  <ArtistLink>{artist.name} •</ArtistLink>
                </Link>
              );
            })}
            <TextSpan>{albumInfo}</TextSpan>
          </div>
        </AlbumInfoContainer>
      </TitleArea>

      <TracksList
        displayMode="album"
        tracks={albumData.tracks.items}
        playTrack={playTrack}
        currentlyPlayingTrackId={currentlyPlayingTrackId}
        isPlaybackPaused={!isPlaying}
        onPlayPause={onPlayPause}
        isTracksListInPlaybackContext={
          albumData.uri == currentlyPlayingContextUri
        }
      />
    </Container>
  );
};

const Container = styled.div`
  padding: ${(props) => props.theme.tokens.marginXl};
  @media screen and (min-width: 1200px) {
    padding: ${(props) => props.theme.tokens.marginXl};
  }
`;

const TitleArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${(props) => props.theme.tokens.marginL};

  margin-bottom: ${(props) => props.theme.tokens.marginXxl};

  @media screen and (min-width: 1200px) {
    flex-direction: row;
    align-items: end;
  }
`;

const H1 = styled.h1`
  color: ${(props) => props.theme.colors.textOnMainBg};
  font-weight: bold;
`;

const ArtistLink = styled.span`
  font-weight: bold;
  color: ${({ theme }) => theme.colors.textOnMainBg};

  &:hover {
    cursor: pointer;
    text-decoration: underline var(--text-on-main-bg);
  }
`;

const TextSpan = styled.span`
  color: ${(props) => props.theme.colors.textOnMainBg};
  font-size: small;
`;

const AlbumInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Img = styled.img`
  width: 60vw;

  @media screen and (min-width: 1200px) {
    width: 360px;
    height: 360px;
  }
`;
