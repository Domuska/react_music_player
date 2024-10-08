"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { HorizontalItemContainer } from "../../../components/HorizontalItemContainer";
import { PlayPauseButton } from "../../../components/Buttons/PlayPauseButton";
import { AllowedSearchTypes } from "../../../components/Spotify/SpotifyApi";
import { useContext } from "react";
import { SpotifyApiContext } from "../context";
import { Artist, SearchResponse } from "../../../components/types";
import { SearchResultContext } from "./searchContext";

export default function () {
  const types: AllowedSearchTypes[] = ["album", "artist"];

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
    <>
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
    </>
  );
}
