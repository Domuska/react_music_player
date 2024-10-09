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
  const types: AllowedSearchTypes[] = ["album", "artist", "track"];
  const [searchResult, setSearchResult] = useState<SearchResponse | null>(null);

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
        return result;
      }
      return null;
    },
  });

  if (!spotifyApiRef) {
    return null;
  }

  const loadMore = async () => {
    if (!query) {
      return;
    }

    if (itemType == "artist" && searchResult?.artists) {
      const currentOffset = searchResult.artists.offset;
      const result = await spotifyApiRef.search(
        query,
        [itemType],
        currentOffset + SEARCH_ITEM_LIMIT,
        SEARCH_ITEM_LIMIT
      );

      if (!result.artists) {
        return;
      }

      const concatenated = searchResult?.artists.items.concat(
        ...(result.artists?.items ?? [])
      );

      const newArtists = result.artists;
      newArtists.items = concatenated;
      setSearchResult({ ...searchResult, artists: newArtists });
    }

    if (itemType == "album" && searchResult?.albums) {
      const currentOffset = searchResult.albums.offset;
      const result = await spotifyApiRef.search(
        query,
        [itemType],
        currentOffset + SEARCH_ITEM_LIMIT,
        SEARCH_ITEM_LIMIT
      );

      if (!result.albums) {
        return;
      }

      const concatenated = searchResult?.albums.items.concat(
        ...(result.albums?.items ?? [])
      );

      const newAlbums = result.albums;
      newAlbums.items = concatenated;
      setSearchResult({ ...searchResult, albums: newAlbums });
    }

    if (itemType == "track" && searchResult?.tracks) {
      const currentOffset = searchResult.tracks.offset;
      const result = await spotifyApiRef.search(
        query,
        [itemType],
        currentOffset + SEARCH_ITEM_LIMIT,
        SEARCH_ITEM_LIMIT
      );

      if (!result.tracks) {
        return;
      }

      const concatenated = searchResult?.tracks.items.concat(
        ...(result.tracks?.items ?? [])
      );

      const newTracks = result.tracks;
      newTracks.items = concatenated;
      setSearchResult({ ...searchResult, tracks: newTracks });
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
