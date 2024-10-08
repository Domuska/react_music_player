"use client";

import { useContext } from "react";
import { SpotifyApiContext } from "../../context";
import { useRouter, useSearchParams } from "next/navigation";
import invariant from "tiny-invariant";
import { SpotifyAPi } from "../../../../components/Spotify/SpotifyApi";
import styled from "styled-components";
import { Album, Artist, SearchResponse } from "../../../../components/types";
import { BorderlessButton } from "../../../../components/IconButtons/IconButtons";
import { PlayableItem } from "../../../../components/PlayableItem";
import { LoadMoreContext, SearchResultContext } from "../searchContext";
import { PlayPauseButton } from "../../../../components/Buttons/PlayPauseButton";

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

  const { data } = useContext<{ data: SearchResponse | null }>(
    SearchResultContext
  );

  const { loadMore } = useContext(LoadMoreContext);

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

  // these two functions are copied from search/page.tsx, simpler to copy
  const openArtistPage = (artistId: string) => {
    const queryParams = new URLSearchParams({
      artistId,
    });
    router.push("/player/artist?" + queryParams.toString());
  };

  const playArtist = (artistUri: string) => {
    spotifyApiRef.playPlayback({ context_uri: artistUri });
  };

  return (
    <Container>
      <ItemContainer>
        {items.map((item: Album | Artist) => {
          const imageUrl = item.images.length > 0 ? item.images[0].url : "";
          return (
            <PlayableItem
              key={item.id}
              imageUrl={imageUrl}
              name={item.name}
              onClick={() => openArtistPage(item.uri)}
              variant="round"
              PlayButton={() => (
                <PlayPauseButton
                  isPaused={true}
                  onClick={() => playArtist(item.uri)}
                  colorVariant="mainAction"
                  size="48px"
                />
              )}
            />
          );
        })}
      </ItemContainer>
      {loadMore && <MoreButton onClick={loadMore}>Load more</MoreButton>}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  gap: 20px;
  flex-direction: column;
  align-items: center;
`;

const ItemContainer = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(3, 1fr);

  @media screen and (min-width: 900px) {
    grid-template-columns: repeat(5, 1fr);
  }
`;

const MoreButton = styled(BorderlessButton)`
  font-weight: bold;
  color: ${({ theme }) => theme.colors.textOnMainBg};
  font-size: xx-large;

  &:hover {
    cursor: pointer;
    text-decoration: underline var(--text-on-main-bg);
  }
`;
