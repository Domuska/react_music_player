"use client";

import { useContext } from "react";
import { SpotifyApiContext } from "../../context";
import { useRouter, useSearchParams } from "next/navigation";
import invariant from "tiny-invariant";
import { SpotifyAPi } from "../../../../components/Spotify/SpotifyApi";
import styled from "styled-components";
import {
  Album,
  Artist,
  SearchResponse,
  SpotifyTrackItem,
} from "../../../../components/types";
import { BorderlessButton } from "../../../../components/IconButtons/IconButtons";
import { PlayableItem } from "../../../../components/PlayableItem";
import { LoadMoreContext, SearchResultContext } from "../searchContext";
import { PlayPauseButton } from "../../../../components/Buttons/PlayPauseButton";
import { Spinner } from "../../../../components/Spinner";

export default () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams?.get("searchQuery");
  const itemType = searchParams?.get("itemType");
  const { spotifyApiRef } = useContext<{ spotifyApiRef: SpotifyAPi }>(
    SpotifyApiContext
  );

  invariant(searchQuery, "search query is required");
  invariant(itemType, "itemType is required");

  if (itemType != "artist" && itemType != "album" && itemType != "track") {
    throw new Error(`Item type ${itemType} not supported yet`);
  }

  const { data } = useContext<{ data: SearchResponse | null }>(
    SearchResultContext
  );

  const { loadMore, canFetchMore, isFetching } = useContext(LoadMoreContext);

  if (!data) {
    return null;
  }

  let items: Album[] | Artist[] | SpotifyTrackItem[] = [];

  if (itemType == "album" && data.albums) {
    items = data.albums.items;
  }

  if (itemType == "artist" && data.artists) {
    items = data.artists.items;
  }

  if (itemType == "track" && data.tracks) {
    items = data.tracks.items;
  }

  const openDetailsPage = (itemId: string) => {
    switch (itemType) {
      case "album":
      case "track": {
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

  const titleTexts = {
    album: "Albums",
    artist: "Artists",
    track: "Tracks",
  };

  return (
    <Container>
      <h1>{titleTexts[itemType]}</h1>
      <ItemContainer>
        {items.map((item: Album | Artist | SpotifyTrackItem) => {
          let imageUrl: string;
          // have to dig up the image from the album, tracks have no images
          if (item.type == "track") {
            const { album } = item;
            imageUrl =
              album.images && album.images.length > 0
                ? album.images[0].url
                : "";
          } else {
            imageUrl =
              item.images && item.images.length > 0 ? item.images[0].url : "";
          }

          return (
            <PlayableItem
              key={item.id}
              imageUrl={imageUrl}
              name={item.name}
              onClick={() =>
                openDetailsPage(item.type == "track" ? item.album.id : item.id)
              }
              variant={item.type == "artist" ? "round" : "square"}
              PlayButton={
                itemType != "track"
                  ? () => (
                      <PlayPauseButton
                        isPaused={true}
                        onClick={() => playItem(item.uri)}
                        colorVariant="mainAction"
                        size="48px"
                      />
                    )
                  : undefined
              }
            />
          );
        })}
      </ItemContainer>

      {loadMore && canFetchMore && (
        <MoreButton onClick={loadMore}>Load more</MoreButton>
      )}

      {isFetching && <Spinner />}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  gap: 20px;
  flex-direction: column;
  align-items: center;

  & h1 {
    font-weight: bold;
    color: ${({ theme }) => theme.colors.textOnMainBg};
    size: xx-large;
  }
`;

const ItemContainer = styled.div`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(3, 1fr);

  @media screen and (min-width: 900px) {
    gap: 20px;
    grid-template-columns: repeat(5, 1fr);
  }
`;

const MoreButton = styled(BorderlessButton)`
  font-weight: bold;
  color: ${({ theme }) => theme.colors.textOnMainBg};
  font-size: x-large;

  &:hover {
    cursor: pointer;
    text-decoration: underline var(--text-on-main-bg);
  }
`;
