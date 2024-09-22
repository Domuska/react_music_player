import { useSuspenseQuery } from "@tanstack/react-query";
import { AllowedSearchTypes, SpotifyAPi } from "../Spotify/SpotifyApi";
import { Suspense } from "react";
import styled from "styled-components";
import { ArtistResults } from "./ArtistResults";

type Props = {
  query: string;
  spotifyApiRef: SpotifyAPi;
  openArtistPage: (artistId: string) => void;
};

const Loading = styled.p`
  width: 500px;
  background-color: aquamarine;
`;

export const SearchResults = ({
  query,
  spotifyApiRef,
  openArtistPage,
}: Props) => {
  const types: AllowedSearchTypes[] = ["album", "artist"];

  const { data } = useSuspenseQuery({
    queryKey: ["search", query, types],
    queryFn: async () => {
      const result = await spotifyApiRef.search(query, types);
      console.log(result);
      return result;
    },
  });

  const playArtist = (artistUri: string) => {
    spotifyApiRef.playPlayback({ context_uri: artistUri });
  };

  return (
    <>
      <Suspense fallback={<Loading>Dis aint working</Loading>}>
        <Container>
          {data.artists && (
            <ArtistResults
              artists={data.artists.items}
              onArtistClick={openArtistPage}
              onArtistPlayClick={playArtist}
              currentlyPlaying={false}
            />
          )}
        </Container>
      </Suspense>
    </>
  );
};

const Container = styled.div`
  padding-top: 25px;
`;
