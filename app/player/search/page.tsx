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

export default function () {
  const types: AllowedSearchTypes[] = ["album", "artist"];

  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams?.get("searchQuery");
  const { spotifyApiRef } = useContext(SpotifyApiContext);

  const { data } = useSuspenseQuery({
    queryKey: ["search", query, types, spotifyApiRef],
    queryFn: async () => {
      if (spotifyApiRef) {
        const result = await spotifyApiRef.search(query, types);
        return result;
      }
      return null;
    },
  });

  if (!spotifyApiRef || !query) {
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

  return (
    <Container>
      {data.artists && (
        <HorizontalItemContainer
          items={data.artists.items.map((artist) => {
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
        />
      )}
    </Container>
  );
}

const Container = styled.div`
  padding: 25px 10px;
`;
