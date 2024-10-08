"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { HorizontalItemContainer } from "../../../components/HorizontalItemContainer";
import { PlayPauseButton } from "../../../components/Buttons/PlayPauseButton";
import { AllowedSearchTypes } from "../../../components/Spotify/SpotifyApi";
import { useContext } from "react";
import { SpotifyApiContext } from "../context";
import { Search } from "../../../components/TopBar/Search";
import { Artist } from "../../../components/types";

export default function () {
  const types: AllowedSearchTypes[] = ["album", "artist"];

  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams?.get("searchQuery");
  const { spotifyApiRef } = useContext(SpotifyApiContext);

  const { data } = useSuspenseQuery({
    queryKey: ["search", query, types, spotifyApiRef],
    queryFn: async () => {
      if (spotifyApiRef && query) {
        const result = await spotifyApiRef.search(query, types);
        return result;
      }
      return null;
    },
  });

  if (!spotifyApiRef) {
    return null;
  }

  const setSearch = (query: string) => {
    const queryParams = new URLSearchParams({
      searchQuery: query,
    });
    router.push("/player/search?" + queryParams.toString());
  };

  const openArtistPage = (artistId: string) => {
    const queryParams = new URLSearchParams({
      artistId,
    });
    router.push("/player/artist?" + queryParams.toString());
  };

  const playArtist = (artistUri: string) => {
    spotifyApiRef.playPlayback({ context_uri: artistUri });
  };

  const getOpenMoreUri = (type: "album" | "artist") => {
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
    <SearchContainer>
      <MobileSearchContainer>
        <Search
          onSearch={setSearch}
          colorTheme="light"
          displayBorder={false}
          displayDatasetButton={false}
        />
      </MobileSearchContainer>

      {data?.artists && (
        <HorizontalItemContainer
          items={data.artists.items.map((artist: Artist) => {
            return {
              ...artist,
              onClick: () => openArtistPage(artist.id),
              PlayButton: () => (
                <PlayPauseButton
                  isPaused={true}
                  onClick={() => playArtist(artist.uri)}
                  colorVariant="mainAction"
                  size="48px"
                />
              ),
            };
          })}
          title={{ text: "Albums" }}
          openMoreUri={getOpenMoreUri("artist")}
        />
      )}
    </SearchContainer>
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
