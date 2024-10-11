"use client";

import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  AllowedSearchTypes,
  SpotifyAPi,
} from "../../../components/Spotify/SpotifyApi";
import { useContext } from "react";
import { SpotifyApiContext } from "../context";
import { Search } from "../../../components/TopBar/Search";
import { LoadMoreContext, SearchResultContext } from "./searchContext";
import { SearchResponse } from "../../../components/types";

const SEARCH_ITEM_LIMIT = 10;

type SearchQueryData = {
  pages: SearchResponse[];
};

const getInitialEmptySearchResponse = (): SearchResponse => {
  return {
    artists: {
      items: [],
      limit: 0,
      next: "",
      offset: 0,
      previous: "",
      total: 0,
    },
    albums: {
      items: [],
      limit: 0,
      next: "",
      offset: 0,
      previous: "",
      total: 0,
    },
    tracks: {
      items: [],
      limit: 0,
      next: "",
      offset: 0,
      previous: "",
      total: 0,
    },
  };
};

const flattenSearchPages = (data: SearchQueryData | null) => {
  if (!data) {
    return;
  }

  const flattenedData = data.pages.reduce((previousValue, currentValue) => {
    // make TS happy, these are set in the initial data
    if (
      !previousValue.artists ||
      !previousValue.albums ||
      !previousValue.tracks
    ) {
      return;
    }

    if (currentValue.artists) {
      const currentItems = currentValue.artists.items;
      const concatenated = previousValue.artists.items.concat(currentItems);
      previousValue.artists.items = concatenated;
    }

    if (currentValue.albums) {
      const currentItems = currentValue.albums.items;
      const concatenated = previousValue.albums.items.concat(currentItems);
      previousValue.albums.items = concatenated;
    }

    if (currentValue.tracks) {
      const currentItems = currentValue.tracks.items;
      const concatenated = previousValue.tracks.items.concat(currentItems);
      previousValue.tracks.items = concatenated;
    }

    return previousValue;
  }, getInitialEmptySearchResponse());

  return flattenedData;
};

const allowedItemTypes: AllowedSearchTypes[] = ["album", "artist", "track"];

export default function ({ children }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams?.get("searchQuery");
  const itemType = searchParams?.get("itemType");
  const { spotifyApiRef } = useContext<{
    spotifyApiRef: SpotifyAPi;
  }>(SpotifyApiContext);

  const setSearch = (query: string) => {
    const queryParams = new URLSearchParams({
      searchQuery: query,
    });
    router.push("/player/search?" + queryParams.toString());
  };

  const setQueryParam = ({
    newQuery,
    newItemType,
  }: {
    newQuery?: string;
    newItemType?: string;
  }) => {
    const sanitizedItemType = itemType ?? "album";
    const sanitizedQuery = query ?? "";
    const queryParams = new URLSearchParams({
      itemType: newItemType ?? sanitizedItemType,
      query: newQuery ?? sanitizedQuery,
    });

    router.push("/player/search?" + queryParams.toString());
  };

  const fetchSpotifySearchData = async ({ pageParam }) => {
    if (spotifyApiRef && query) {
      const result = await spotifyApiRef.search(
        query,
        allowedItemTypes,
        pageParam ?? 0,
        SEARCH_ITEM_LIMIT
      );
      return result;
    }
    return {};
  };

  const {
    data,
    fetchNextPage,
    isFetching,
    hasNextPage,
  }: {
    data: SearchResponse | undefined;
    fetchNextPage: VoidFunction;
    isFetching: boolean;
    hasNextPage: boolean;
  } = useSuspenseInfiniteQuery({
    queryKey: ["search", query, allowedItemTypes, spotifyApiRef, itemType],
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      // todo just hard-coded value for now
      // real implementation should check what is the current type
      // we are showing on this page, and see if spotify tells there's more items
      if (lastPage.artists && lastPage.artists.offset < 30) {
        return lastPage?.artists.offset + SEARCH_ITEM_LIMIT;
      }
    },
    queryFn: fetchSpotifySearchData,
    select: flattenSearchPages,
  });

  if (!spotifyApiRef || !data) {
    return null;
  }

  const loadMore = async () => {
    if (!isFetching && hasNextPage) {
      fetchNextPage();
    }
  };

  return (
    <SearchResultContext.Provider value={{ data }}>
      <LoadMoreContext.Provider
        value={{
          loadMore,
          canFetchMore: !isFetching && hasNextPage,
          isFetching,
        }}
      >
        <SearchContainer>
          <MobileSearchContainer>
            <Search
              onSearch={setSearch}
              colorTheme="light"
              displayBorder={false}
              displayDatasetButton={false}
            />
          </MobileSearchContainer>
          {children}
        </SearchContainer>
      </LoadMoreContext.Provider>
    </SearchResultContext.Provider>
  );
}

const SearchContainer = styled.div`
  padding: ${(props) => props.theme.tokens.marginXxl};
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.tokens.marginXl};
`;

const MobileSearchContainer = styled.div`
  display: flex;
  justify-content: center;

  @media screen and (min-width: 1200px) {
    display: none;
  }
`;
