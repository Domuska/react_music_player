"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { TracksList } from "../../../components/TracksList/TracksList";
import { CurrentPlaybackContext, SpotifyApiContext } from "../context";
import { useContext } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import invariant from "tiny-invariant";
import { SpotifyAPi } from "../../../components/Spotify/SpotifyApi";

export default () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const albumId = searchParams?.get("albumId");
  const { spotifyApiRef } = useContext<{
    spotifyApiRef: SpotifyAPi;
  }>(SpotifyApiContext);
  const currentPlaybackStatus = useContext(CurrentPlaybackContext);

  invariant(albumId, "Album id is required");

  const { error: albumRequestError, data: albumData } = useSuspenseQuery({
    queryKey: ["albumData", albumId, spotifyApiRef],
    queryFn: async () => {
      if (!spotifyApiRef) {
        return null;
      }
      const result = await spotifyApiRef.fetchAlbum(albumId);
      return result;
    },
  });

  if (!albumData) {
    return null;
  }

  const playTrack = (trackUri: string) => {
    return spotifyApiRef.playPlayback({
      context_uri: albumData.uri,
      offset: trackUri,
    });
  };

  const currentlyPlayingTrackId = currentPlaybackStatus?.item.id;
  const isPlaying = currentPlaybackStatus?.is_playing;
  const currentlyPlayingContextUri = currentPlaybackStatus?.context?.uri;

  const onPlayPause = () => {
    if (isPlaying) {
      spotifyApiRef.pausePlayback();
    } else {
      spotifyApiRef.playPlayback();
    }
  };

  return (
    <TracksList
      displayMode="album"
      tracks={albumData.tracks.items}
      playTrack={playTrack}
      currentlyPlayingTrackId={currentlyPlayingTrackId}
      isPlaybackPaused={!isPlaying}
      onPlayPause={onPlayPause}
      isTracksListInPlaybackContext={
        albumData.uri == currentlyPlayingContextUri
      }
    />
  );
};
