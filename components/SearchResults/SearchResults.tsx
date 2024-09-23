import { useSuspenseQuery } from "@tanstack/react-query";
import { AllowedSearchTypes, SpotifyAPi } from "../Spotify/SpotifyApi";
import styled from "styled-components";
import { ArtistsSearchResult } from "./ArtistResult";

type Props = {
  query: string;
  spotifyApiRef: SpotifyAPi;
  openArtistPage: (artistId: string) => void;
};

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
      return result;
    },
  });

  const playArtist = (artistUri: string) => {
    spotifyApiRef.playPlayback({ context_uri: artistUri });
  };

  return (
    <Container>
      {data.artists && (
        <ArtistsSearchResult
          artists={data.artists.items}
          onArtistClick={openArtistPage}
          onArtistPlayClick={playArtist}
          currentlyPlaying={false}
        />
      )}
    </Container>
  );
};

const Container = styled.div`
  padding-top: 25px;
`;
