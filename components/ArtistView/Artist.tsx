import styled from "styled-components";
import { SpotifyAPi } from "../Spotify/SpotifyApi";
import { useSuspenseQueries } from "@tanstack/react-query";
import { TracksList } from "../TracksList/TracksList";

type Props = {
  artistId: string;
  spotifyApiRef: SpotifyAPi;
  currentlyPlayingContextUri?: string;
  //todo these 2 fields should go away, TracksList needs refactoring
  currentlyPlayingTrackId?: React.ComponentProps<
    typeof TracksList
  >["currentlyPlayingTrackId"];
  isPlaybackPaused: React.ComponentProps<typeof TracksList>["isPlaybackPaused"];
  onPlayPause: React.ComponentProps<typeof TracksList>["onPlayPause"];
};

export const Artist = ({
  artistId,
  spotifyApiRef,
  currentlyPlayingContextUri,
  currentlyPlayingTrackId,
  isPlaybackPaused,
  onPlayPause,
}: Props) => {
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

  const playTrack = (trackUri: string) => {
    // we should pass in artist.uri as context, but the API doesn't support it :/
    return spotifyApiRef.playPlayback({
      context_uri: artist.uri,
      offset: trackUri,
    });
  };

  // todo add button to play the whole artist context
  // todo remove the individual play buttons, make the row open the album

  return (
    <Container>
      <img src={imgSrc} />
      <ArtistName>{artist.name}</ArtistName>
      <TracksList
        displayMode="album"
        isPlaybackPaused={isPlaybackPaused}
        currentlyPlayingTrackId={currentlyPlayingTrackId}
        onPlayPause={onPlayPause}
        playTrack={playTrack}
        tracks={topTracks}
        isTracksListInPlaybackContext={
          currentlyPlayingContextUri === artist.uri
        }
      />
    </Container>
  );
};

const Container = styled.div``;

const ArtistName = styled.h1`
  color: ${(props) => props.theme.colors.textOnMainBg};
`;
