"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { HorizontalItemContainer } from "../../../components/HorizontalItemContainer";
import { PlayPauseButton } from "../../../components/Buttons/PlayPauseButton";
import { useContext } from "react";
import { SpotifyApiContext } from "../context";
import {
  Album,
  Artist,
  SearchResponse,
  SpotifyTrackItem,
} from "../../../components/types";
import { SearchResultContext } from "./searchContext";
import styled from "styled-components";

export default function () {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams?.get("searchQuery");
  const { spotifyApiRef } = useContext(SpotifyApiContext);

  const { data } = useContext<{ data: SearchResponse | null }>(
    SearchResultContext
  );

  if (!spotifyApiRef) {
    return null;
  }

  const openArtistPage = (artistId: string) => {
    const queryParams = new URLSearchParams({
      artistId,
    });
    router.push("/player/artist?" + queryParams.toString());
  };

  const playContext = (contextUri: string) => {
    spotifyApiRef.playPlayback({ context_uri: contextUri });
  };

  const getOpenMoreUri = (type: "album" | "artist" | "track") => {
    if (query) {
      const queryParams = new URLSearchParams({
        searchQuery: query,
        itemType: type,
      });
      return "/player/search/more?" + queryParams.toString();
    }
    return "";
  };

  return (
    <Container>
      {data?.artists && (
        <HorizontalItemContainer
          items={data.artists.items.map((artist: Artist) => {
            const { images } = artist;
            const image = images && images.length > 0 ? images[0] : undefined;
            return {
              ...artist,
              image,
              onClick: () => openArtistPage(artist.id),
              PlayButton: () => (
                <PlayPauseButton
                  isPaused={true}
                  onClick={() => playContext(artist.uri)}
                  colorVariant="mainAction"
                  size="48px"
                />
              ),
            };
          })}
          title={{ text: "Artists" }}
          openMoreUri={getOpenMoreUri("artist")}
          variant="round"
        />
      )}

      {data?.albums && (
        <HorizontalItemContainer
          items={data.albums.items.map((album: Album) => {
            const { images } = album;
            const image = images && images.length > 0 ? images[0] : undefined;
            return {
              ...album,
              image,
              onClick: () => openArtistPage(album.id),
              PlayButton: () => (
                <PlayPauseButton
                  isPaused={true}
                  onClick={() => playContext(album.uri)}
                  colorVariant="mainAction"
                  size="48px"
                />
              ),
            };
          })}
          title={{ text: "Albums" }}
          openMoreUri={getOpenMoreUri("album")}
        />
      )}

      {data?.tracks && (
        <HorizontalItemContainer
          items={data.tracks.items.map((track: SpotifyTrackItem) => {
            const { album } = track;
            const image =
              album.images && album.images.length > 0
                ? album.images[0]
                : undefined;
            return {
              ...track,
              image,
              onClick: () => openArtistPage(track.id),
              PlayButton: () => (
                <PlayPauseButton
                  isPaused={true}
                  onClick={() => playContext(track.uri)}
                  colorVariant="mainAction"
                  size="48px"
                />
              ),
            };
          })}
          title={{ text: "Tracks" }}
          openMoreUri={getOpenMoreUri("track")}
        />
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
