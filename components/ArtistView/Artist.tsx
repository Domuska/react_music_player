import styled from "styled-components";
import { SpotifyAPi } from "../Spotify/SpotifyApi";
import { useSuspenseQueries } from "@tanstack/react-query";
import { TracksList } from "../TracksList/TracksList";

type Props = {
  artistId: string;
  spotifyApiRef: SpotifyAPi;
};

export const Artist = ({ artistId, spotifyApiRef }: Props) => {
  const fetchArtist = {
    queryKey: ["artist", artistId],
    queryFn: async () => {
      const result = await spotifyApiRef.fetchArtist(artistId);
      return result;
    },
  };

  const fetchTopTracks = {
    queryKey: ["artist-top-tracks", artistId],
    queryFn: async () => {
      const result = await spotifyApiRef.fetchArtistTopTracks(artistId);
      return result;
    },
  };

  const [artistResult, topTracksResult] = useSuspenseQueries({
    queries: [fetchArtist, fetchTopTracks],
  });

  const { data: artist } = artistResult;
  const { data: topTracks } = topTracksResult;

  const imgSrc = artist.images[0].url ?? "";

  return (
    <Container>
      <img src={imgSrc} />
      <ArtistName>{artist.name}</ArtistName>
      <TracksList
        contextUri={artist.uri}
        displayMode="album"
        isPlaybackPaused={false}
        pausePlayback={() => {}}
        playTrack={() => {}}
        tracks={topTracks}
      />
    </Container>
  );
};

const Container = styled.div``;

const ArtistName = styled.h1`
  color: ${(props) => props.theme.colors.textOnMainBg};
`;
