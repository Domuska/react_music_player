import { useSuspenseQuery } from "@tanstack/react-query";
import { AllowedSearchTypes, SpotifyAPi } from "../Spotify/SpotifyApi";
import { Suspense } from "react";
import styled from "styled-components";

type Props = {
  query: string;
  spotifyApiRef: SpotifyAPi;
};

const Loading = styled.p`
  width: 500px;
  background-color: aquamarine;
`;

export const SearchResults = ({ query, spotifyApiRef }: Props) => {
  const types: AllowedSearchTypes[] = ["album"];

  const { data, isFetching } = useSuspenseQuery({
    queryKey: ["search", query, types],
    queryFn: async () => {
      const result = await spotifyApiRef.search(query, types);
      console.log(result);
      return result;
    },
  });

  return (
    <>
      {isFetching && <Loading>No eri loadings sit</Loading>}
      <Suspense fallback={<Loading>Loadings</Loading>}>
        <p>{JSON.stringify(data)}</p>
      </Suspense>
    </>
  );
};
