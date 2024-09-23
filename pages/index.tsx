"use client";

import styles from "../styles/Home.module.css";
import { useEffect, useRef, useState } from "react";
import { PlaybackControls } from "../components/PlaybackControls";
import { TracksList } from "../components/TracksList/TracksList";
import { Library } from "../components/Library";
import { VolumeControls } from "../components/VolumeBar/VolumeControls";
import SpotifyWebPlayback from "../components/Spotify/SpotifyWebPlayback";
import { api, SpotifyAPi } from "../components/Spotify/SpotifyApi";
import { ACCESS_TOKEN_COOKIE_NAME } from "./api/auth/callback";
import { getCookieByName } from "../utils/getCookieByName";
import { sleep } from "../utils/sleep";
import { CurrentPlaybackInfo } from "../components/CurrentPlaybackInfo";
import { TopBar } from "../components/TopBar/TopBar";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { SearchResults } from "../components/SearchResults/SearchResults";

const ONE_SECOND = 1000;
const HALF_SECONDS = 500;

const Login = () => {
  return (
    <div className="App">
      <header className="App-header">
        <a className="btn-spotify" href="api/auth/login">
          Login with Spotify
        </a>
      </header>
    </div>
  );
};

const queryClient = new QueryClient();

type VisibleMainContent = "searchResults" | "album";

export default function () {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
}
const App = () => {
  const [volumeState, setVolumeState] = useState<{
    isMuted: boolean;
    volumeBeforeMute: number;
  }>({ isMuted: false, volumeBeforeMute: 0 });

  const [currentAlbumId, setCurrentAlbumId] = useState<string>("");
  const {
    isPending: albumRequestPending,
    error: albumRequestError,
    data: albumData,
  } = useQuery({
    queryKey: ["albumData", currentAlbumId],
    queryFn: async () => {
      const result = await spotifyApiRef.current?.fetchAlbum(currentAlbumId);
      return result;
    },
    enabled: !!currentAlbumId,
  });

  const [token, setToken] = useState<string>("");

  const spotifyApiRef = useRef<SpotifyAPi | undefined>();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [visibleMainContent, setVisibleMainContent] =
    useState<VisibleMainContent | null>(null);

  useEffect(() => {
    const access_token = getCookieByName(ACCESS_TOKEN_COOKIE_NAME);
    setToken(access_token ?? "");

    if (access_token) {
      spotifyApiRef.current = api(token);
    }
  }, [token]);

  // todo if we playback is not ongoing, no need to fetch data as often
  const {
    isPending: currentInfoPending,
    error: currentInfoError,
    data: currentSpotifyData,
    refetch: refetchCurrentSpotifyData,
  } = useQuery({
    queryKey: ["currentData"],
    queryFn: async () => {
      const response = await spotifyApiRef.current?.getPlaybackStatus();
      if (response && response.currently_playing_type == "track") {
        return response;
      } else {
        console.log(
          "response currently playing type is " +
            response?.currently_playing_type +
            ". Not supported yet."
        );
        Promise.reject("Invalid response");
      }
    },
    refetchInterval: ONE_SECOND,
    enabled: !!spotifyApiRef.current,
  });

  if (!token) {
    return <Login />;
  }

  const spotifyOnPlayPauseClick = async () => {
    if (currentSpotifyData?.is_playing) {
      await spotifyApiRef.current?.pausePlayback();
    } else {
      await spotifyApiRef.current?.playPlayback();
    }
    // the API is fairly slow, if we call it immediately the playback status is not updated
    await sleep(500);
    refetchCurrentSpotifyData();
  };

  const playSong = (contextUri: string, trackUri: string) => {
    return spotifyApiRef.current?.playPlayback({
      context_uri: contextUri,
      track_uri: trackUri,
    });
  };

  const onArtistClick = (artistId: string) => {
    console.log("onArtistClick", artistId);
  };

  const openAlbumData = async (albumId: string) => {
    setCurrentAlbumId(albumId);
    setVisibleMainContent("album");
  };

  const onSeek = async (timeMs: number) => {
    await spotifyApiRef.current?.seek(timeMs);
    await sleep(700);
    refetchCurrentSpotifyData();
  };

  const onVolumeChange = async (newVolume: number) => {
    if (volumeState.isMuted) {
      setVolumeState({ isMuted: false, volumeBeforeMute: newVolume });
    }
    await spotifyApiRef.current?.setVolume(newVolume);
    refetchCurrentSpotifyData();
  };

  const onMuteClick = () => {
    const { isMuted, volumeBeforeMute } = volumeState;

    if (isMuted) {
      onVolumeChange(volumeState.volumeBeforeMute);
      setVolumeState({ isMuted: false, volumeBeforeMute });
    } else {
      onVolumeChange(0);

      setVolumeState({
        isMuted: true,
        volumeBeforeMute: currentSpotifyData?.device.volume_percent ?? 25,
      });
    }
  };

  const onSearch = async (query: string) => {
    setSearchTerm(query);
    if (query) {
      setVisibleMainContent("searchResults");
    } else {
      setVisibleMainContent(null);
    }
  };

  return (
    <div className={styles.gridContainer}>
      {/* The Spotify playback component */}
      <SpotifyWebPlayback token={token} />

      <span className={styles.searchNavBar}>
        <TopBar onSearch={onSearch} />
      </span>
      <div className={styles.leftNav}>
        <Library />
      </div>
      <div className={styles.mainContent}>
        {visibleMainContent == "album" &&
          albumData &&
          spotifyApiRef.current && (
            <TracksList
              displayMode="album"
              tracks={albumData.tracks.items}
              contextUri={albumData.uri}
              playTrack={playSong}
              currentlyPlayingTrackId={currentSpotifyData?.item.id}
              isPlaybackPaused={!currentSpotifyData?.is_playing}
              pausePlayback={spotifyOnPlayPauseClick}
            />
          )}

        {visibleMainContent == "searchResults" &&
          searchTerm &&
          spotifyApiRef.current && (
            <SearchResults
              query={searchTerm}
              spotifyApiRef={spotifyApiRef.current}
              openArtistPage={onArtistClick}
            />
          )}
      </div>
      <span className={styles.rightNav}>oikea nav</span>

      <span className={styles.bottomGrid}>
        <CurrentPlaybackInfo
          album={currentSpotifyData?.item.album}
          trackTitle={currentSpotifyData?.item.name}
          artists={currentSpotifyData?.item.artists}
          onArtistClick={onArtistClick}
          onTrackClick={openAlbumData}
        />

        <PlaybackControls
          pausePlayOnclick={spotifyOnPlayPauseClick}
          skipToNextOnClick={spotifyApiRef.current?.skipToNext}
          skipToPreviousOnClick={spotifyApiRef.current?.skipToPrevious}
          totalPlaybackDuration={currentSpotifyData?.item.duration_ms}
          currentPlaybackTime={currentSpotifyData?.progress_ms}
          isPlaybackPaused={!currentSpotifyData?.is_playing}
          onSeek={onSeek}
        />

        <VolumeControls
          onVolumeChange={onVolumeChange}
          volumePercentage={currentSpotifyData?.device.volume_percent ?? 0}
          onMuteClick={onMuteClick}
          isMuted={volumeState.isMuted}
        />
      </span>

      {/* For styling the automatic padding & margin on the whole web page */}
      <style>{`
      html,
      body {
        padding: 0;
        margin: 0;
        font-family:
          -apple-system,
          BlinkMacSystemFont,
          Segoe UI,
          Roboto,
          Oxygen,
          Ubuntu,
          Cantarell,
          Fira Sans,
          Droid Sans,
          Helvetica Neue,
          sans-serif;
      }
      * {
        box-sizing: border-box;
      }
    `}</style>
    </div>
  );
};
