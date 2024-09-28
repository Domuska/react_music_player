import { useSuspenseQuery } from "@tanstack/react-query";
import { AllowedSearchTypes, SpotifyAPi } from "../Spotify/SpotifyApi";
import styled from "styled-components";
import { HorizontalItemContainer } from "./HorizontalItemContainer";
import { PlayPauseButton } from "../Buttons/PlayPauseButton";

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
                />
              ),
            };
          })}
          title={{ text: "Albums" }}
        />
      )}
    </Container>
  );
};

const Container = styled.div`
  padding: 25px 10px;
`;
