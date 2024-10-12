"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { HorizontalItemContainer } from "../../../components/HorizontalItemContainer";
import { PlayPauseButton } from "../../../components/Buttons/PlayPauseButton";
import { useContext } from "react";
import { SpotifyApiContext } from "../context";
import { Album, Artist, SpotifyTrackItem } from "../../../components/types";
import { SearchResultContext, SearchResultContextType } from "./searchContext";
import styled from "styled-components";
import { Spinner } from "../../../components/Spinner";

export default function () {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams?.get("searchQuery");
  const { spotifyApiRef } = useContext(SpotifyApiContext);

  const { data, isFetching } =
    useContext<SearchResultContextType>(SearchResultContext);

  if (!spotifyApiRef || isFetching) {
    return <Spinner />;
  }

  const openDetailsPage = (itemId: string, itemType: "album" | "artist") => {
    switch (itemType) {
      case "album": {
        const queryParams = new URLSearchParams({
          albumId: itemId,
        });
        router.push("/player/album?" + queryParams.toString());
        return;
      }

      case "artist": {
        const queryParams = new URLSearchParams({
          artistId: itemId,
        });
        router.push("/player/artist?" + queryParams.toString());
        return;
      }

      default: {
        throw new Error("unknown item type");
      }
    }
  };

  const playItem = (uri: string) => {
    spotifyApiRef.playPlayback({ context_uri: uri });
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
              onClick: () => openDetailsPage(artist.id, "artist"),
              PlayButton: () => (
                <PlayPauseButton
                  isPaused={true}
                  onClick={() => playItem(artist.uri)}
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
              onClick: () => openDetailsPage(album.id, "album"),
              PlayButton: () => (
                <PlayPauseButton
                  isPaused={true}
                  onClick={() => playItem(album.uri)}
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
              onClick: () => openDetailsPage(track.album.id, "album"),
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
