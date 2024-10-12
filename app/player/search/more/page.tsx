"use client";

import { useContext } from "react";
import { SpotifyApiContext } from "../../context";
import { useRouter, useSearchParams } from "next/navigation";
import invariant from "tiny-invariant";
import { SpotifyAPi } from "../../../../components/Spotify/SpotifyApi";
import styled from "styled-components";
import { Album, Artist, SpotifyTrackItem } from "../../../../components/types";
import { BorderlessButton } from "../../../../components/IconButtons/IconButtons";
import { PlayableItem } from "../../../../components/PlayableItem";
import { SearchResultContext, SearchResultContextType } from "../searchContext";
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

  const { data, loadMore, canFetchMore, isFetching } =
    useContext<SearchResultContextType>(SearchResultContext);

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

  const openAlbumPage = (albumId: string) => {
    const queryParams = new URLSearchParams({
      albumId,
    });
    router.push("/player/album?" + queryParams.toString());
  };

  const openArtistPage = (artistId: string) => {
    const queryParams = new URLSearchParams({
      artistId,
    });
    router.push("/player/artist?" + queryParams.toString());
  };

  const playItem = (uri: string) => {
    spotifyApiRef.playPlayback({ context_uri: uri });
  };

  const mapItem = (item: Album | Artist | SpotifyTrackItem) => {
    const { type } = item;
    switch (type) {
      case "album": {
        return (
          <PlayableItem
            key={item.id}
            imageUrl={item.images?.[0].url}
            name={item.name}
            onClick={() => openAlbumPage(item.id)}
            variant={"square"}
            PlayButton={() => (
              <PlayPauseButton
                isPaused={true}
                onClick={() => playItem(item.uri)}
                colorVariant="mainAction"
                size="48px"
              />
            )}
          />
        );
      }

      case "artist": {
        return (
          <PlayableItem
            key={item.id}
            imageUrl={item.images?.[0].url}
            name={item.name}
            onClick={() => openArtistPage(item.id)}
            variant={"round"}
            PlayButton={() => (
              <PlayPauseButton
                isPaused={true}
                onClick={() => playItem(item.uri)}
                colorVariant="mainAction"
                size="48px"
              />
            )}
          />
        );
      }

      case "track": {
        return (
          <PlayableItem
            key={item.id}
            imageUrl={item.album.images?.[0].url}
            name={item.name}
            onClick={() => openAlbumPage(item.album.id)}
            variant={"square"}
          />
        );
      }

      default: {
        console.error("unknown item type:", type);
        return null;
      }
    }
  };

  const titleTexts = {
    album: "Albums",
    artist: "Artists",
    track: "Tracks",
  };

  return (
    <Container>
      <h1>{titleTexts[itemType]}</h1>
      <ItemContainer>{items.map(mapItem)}</ItemContainer>

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
