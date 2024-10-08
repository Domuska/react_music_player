"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  AllowedSearchTypes,
  SpotifyAPi,
} from "../../../components/Spotify/SpotifyApi";
import { useContext, useState } from "react";
import { SpotifyApiContext } from "../context";
import { Search } from "../../../components/TopBar/Search";
import { LoadMoreContext, SearchResultContext } from "./searchContext";
import { SearchResponse } from "../../../components/types";

const SEARCH_ITEM_LIMIT = 10;

export default function ({ children }) {
  const types: AllowedSearchTypes[] = ["album", "artist"];
  const [searchResult, setSearchResult] = useState<SearchResponse | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams?.get("searchQuery");
  const itemType = searchParams?.get("itemType");
  const currentOffset = searchParams?.get("offset") ?? undefined;
  const { spotifyApiRef } = useContext<{
    spotifyApiRef: SpotifyAPi;
  }>(SpotifyApiContext);

  const offsetNumber = Number.parseInt(currentOffset || "0", 10);

  const setSearch = (query: string) => {
    const queryParams = new URLSearchParams({
      searchQuery: query,
    });
    router.push("/player/search?" + queryParams.toString());
  };

  useSuspenseQuery({
    queryKey: ["search", query, types, spotifyApiRef],
    queryFn: async () => {
      if (spotifyApiRef && query) {
        const result = await spotifyApiRef.search(
          query,
          types,
          0,
          SEARCH_ITEM_LIMIT
        );

        setSearchResult(result);
        // todo set offset query param to SEARCH_ITEM_LIMIT somehow
        return result;
      }
      return null;
    },
  });

  if (!spotifyApiRef) {
    return null;
  }

  const loadMore = async () => {
    if (query && itemType == "artist" && searchResult?.artists) {
      const result = await spotifyApiRef.search(
        query,
        [itemType],
        offsetNumber + SEARCH_ITEM_LIMIT,
        SEARCH_ITEM_LIMIT
      );

      const concatenated = searchResult?.artists.items.concat(
        ...(result.artists?.items ?? [])
      );
      console.log(concatenated);

      const newArtists = { ...searchResult.artists };
      newArtists.items = concatenated;
      setSearchResult({ ...searchResult, artists: newArtists });
      // todo increment offset
      // todo try to make this a bit more generic, it needs to work for songs & artists too
      // todo this can just be more statements: if (query && itemType == "album") etc too
    }
  };

  return (
    <SearchResultContext.Provider value={{ data: searchResult }}>
      <LoadMoreContext.Provider value={{ loadMore }}>
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
  padding: 25px 10px;
`;

const MobileSearchContainer = styled.div`
  display: flex;
  justify-content: center;

  @media screen and (min-width: 1200px) {
    display: none;
  }
`;
