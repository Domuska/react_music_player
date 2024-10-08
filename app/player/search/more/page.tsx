"use client";

import { useContext } from "react";
import { SpotifyApiContext } from "../../context";
import { useRouter, useSearchParams } from "next/navigation";
import invariant from "tiny-invariant";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SpotifyAPi } from "../../../../components/Spotify/SpotifyApi";
import styled from "styled-components";
import { Album, Artist } from "../../../../components/types";
import { BorderlessButton } from "../../../../components/IconButtons/IconButtons";
import { PlayableItem } from "../../../../components/PlayableItem";

export default () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams?.get("searchQuery");
  const itemType = searchParams?.get("itemType");
  const currentOffset = searchParams?.get("offset");
  const { spotifyApiRef } = useContext<{ spotifyApiRef: SpotifyAPi }>(
    SpotifyApiContext
  );

  invariant(searchQuery, "search query is required");
  invariant(itemType, "itemType is required");

  if (itemType != "artist" && itemType != "album") {
    throw new Error(`Item type ${itemType} not supported yet`);
  }

  const loadMore = () => {
    console.log("loading moar.");
  };

  const { data } = useSuspenseQuery({
    queryKey: ["query", currentOffset, searchQuery, itemType, spotifyApiRef],
    queryFn: async () => {
      if (spotifyApiRef) {
        const offset = currentOffset ?? "0";

        const result = await spotifyApiRef.search(
          searchQuery,
          [itemType],
          offset
        );
        return result;
      }
      return null;
    },
  });

  if (!data) {
    return null;
  }

  let items: Album[] | Artist[] = [];

  if (itemType == "album" && data.albums) {
    items = data.albums.items;
  }

  if (itemType == "artist" && data.artists) {
    items = data.artists.items;
  }

  return (
    <>
      <ItemContainer>
        {items.map((item: Album | Artist) => {
          return (
            <PlayableItem
              key={item.id}
              imageUrl=""
              name={item.name}
              onClick={() => {}}
              variant="round"
            />
          );
        })}
      </ItemContainer>
      <MoreButton onClick={loadMore}>Load more</MoreButton>
    </>
  );
};

const ItemContainer = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(3, 1fr);
`;

const MoreButton = styled(BorderlessButton)``;
