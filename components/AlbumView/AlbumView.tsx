import { useSuspenseQuery } from "@tanstack/react-query";
import { SpotifyAPi } from "../Spotify/SpotifyApi";
import { TracksList } from "../TracksList/TracksList";

type Props = {
  albumId: string;
  spotifyApiRef: SpotifyAPi;
  currentlyPlayingContextUri?: string;
  currentlyPlayingTrackId?: React.ComponentProps<
    typeof TracksList
  >["currentlyPlayingTrackId"];
  isPlaybackPaused: React.ComponentProps<typeof TracksList>["isPlaybackPaused"];
  onPlayPause: React.ComponentProps<typeof TracksList>["onPlayPause"];
};

export const AlbumView = ({
  albumId,
  spotifyApiRef,
  currentlyPlayingTrackId,
  isPlaybackPaused,
  onPlayPause,
  currentlyPlayingContextUri,
}: Props) => {
  const { error: albumRequestError, data: albumData } = useSuspenseQuery({
    queryKey: ["albumData", albumId],
    queryFn: async () => {
      const result = await spotifyApiRef.fetchAlbum(albumId);
      return result;
    },
  });

  const playTrack = (trackUri: string) => {
    return spotifyApiRef.playPlayback({
      context_uri: albumData.uri,
      offset: trackUri,
    });
  };

  return (
    <TracksList
      displayMode="album"
      tracks={albumData.tracks.items}
      playTrack={playTrack}
      currentlyPlayingTrackId={currentlyPlayingTrackId}
      isPlaybackPaused={isPlaybackPaused}
      onPlayPause={onPlayPause}
      isTracksListInPlaybackContext={
        albumData.uri == currentlyPlayingContextUri
      }
    />
  );
};
