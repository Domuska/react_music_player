"use client";

import styles from "./layout.module.css";
import { useCallback, useContext, useEffect, useState } from "react";
import { Library } from "../../components/Library";
import SpotifyWebPlayback from "../../components/Spotify/SpotifyWebPlayback";
import { api, SpotifyAPi } from "../../components/Spotify/SpotifyApi";
import { ACCESS_TOKEN_COOKIE_NAME } from "../../pages/api/player/auth/callback";
import { getCookieByName } from "../../utils/getCookieByName";
import { sleep } from "../../utils/sleep";
import { TopBar } from "../../components/TopBar/TopBar";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { ThemeProvider } from "styled-components";
import { theme } from "../../styles/defaultTheme";
import {
  CurrentPlaybackContext,
  SpotifyApiContext,
  SpotifyApiContextWrapper,
} from "./context";
import { useRouter } from "next/navigation";
import { BottomBar } from "../../components/BottomBar/BottomBar";

const ONE_SECOND = 1000;
const HALF_SECONDS = 500;

const Login = () => {
  return (
    <div className="App">
      <header className="App-header">
        <a className="btn-spotify" href="/api/player/auth/login">
          Login with Spotify
        </a>
      </header>
    </div>
  );
};

const LoadingState = () => {
  return <div>Imagine a spinner spinning</div>;
};

const queryClient = new QueryClient();

export default function ({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <SpotifyApiContextWrapper>
          <App>{children}</App>
        </SpotifyApiContextWrapper>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

const App = ({ children }: { children: React.ReactNode }) => {
  const [volumeState, setVolumeState] = useState<{
    isMuted: boolean;
    volumeBeforeMute: number;
  }>({ isMuted: false, volumeBeforeMute: 0 });

  const router = useRouter();
  const [token, setToken] = useState<string>("");

  const { spotifyApiRef, setSpotifyApiRef } = useContext<{
    spotifyApiRef: SpotifyAPi;
    setSpotifyApiRef: any;
  }>(SpotifyApiContext);

  useEffect(() => {
    const access_token = getCookieByName(ACCESS_TOKEN_COOKIE_NAME);
    setToken(access_token ?? "");
  }, []);

  // todo if we playback is not ongoing, no need to fetch data as often
  const {
    isPending: currentInfoPending,
    error: currentInfoError,
    data: currentSpotifyData,
    refetch: refetchCurrentSpotifyData,
  } = useQuery({
    queryKey: ["currentData"],
    queryFn: async () => {
      const response = await spotifyApiRef.getPlaybackStatus();
      if (!response) {
        return null;
      }

      if (response && response.currently_playing_type == "track") {
        return response;
      } else {
        console.log(
          "response currently playing type is " +
            response?.currently_playing_type +
            ". Not supported yet."
        );
        return null;
      }
    },
    refetchInterval: ONE_SECOND,
    enabled: !!spotifyApiRef,
  });

  const onSpotifyPlayerReady = useCallback(
    (playerId: string) => {
      setSpotifyApiRef(api(token, playerId));
    },
    [setSpotifyApiRef, token]
  );

  if (!token) {
    return <Login />;
  }

  const spotifyOnPlayPauseClick = async () => {
    if (currentSpotifyData?.is_playing) {
      await spotifyApiRef.pausePlayback();
    } else {
      await spotifyApiRef.playPlayback();
    }
    // the API is fairly slow, if we call it immediately the playback status is not updated
    await sleep(500);
    refetchCurrentSpotifyData();
  };

  const onSeek = async (timeMs: number) => {
    await spotifyApiRef.seek(timeMs);
    await sleep(700);
    refetchCurrentSpotifyData();
  };

  const onVolumeChange = async (newVolume: number) => {
    if (volumeState.isMuted) {
      setVolumeState({ isMuted: false, volumeBeforeMute: newVolume });
    }
    await spotifyApiRef.setVolume(newVolume);
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

  const onStateUpdate = (newState: any) => {
    console.log(newState);
  };

  const onSearch = (query: string) => {
    const queryParams = new URLSearchParams({
      searchQuery: query,
    });
    router.push("/player/search?" + queryParams.toString());
  };

  const onOpenArtist = (artistId: string) => {
    const queryParams = new URLSearchParams({
      artistId,
    });
    router.push("/player/artist?" + queryParams.toString());
  };

  const onOpenAlbum = async (albumId: string) => {
    const queryParams = new URLSearchParams({
      albumId,
    });
    router.push("/player/album?" + queryParams.toString());
  };

  return (
    <div>
      {/* The Spotify playback component */}
      <SpotifyWebPlayback
        token={token}
        onPlayerReady={onSpotifyPlayerReady}
        onStateUpdate={onStateUpdate}
      />
      <div className={styles.container}>
        <span className={styles.searchNavBar}>
          <TopBar onSearch={onSearch} />
        </span>

        <div className={styles.libraryNav}>
          <Library />
        </div>

        <div className={styles.mainContent}>
          <CurrentPlaybackContext.Provider value={currentSpotifyData}>
            {children}
          </CurrentPlaybackContext.Provider>
        </div>

        <BottomBar
          currentSpotifyData={currentSpotifyData}
          isMuted={volumeState.isMuted}
          onMuteClick={onMuteClick}
          onOpenAlbum={onOpenAlbum}
          onOpenArtist={onOpenArtist}
          onSeek={onSeek}
          onVolumeChange={onVolumeChange}
          spotifyApiRef={spotifyApiRef}
          spotifyOnPlayPauseClick={spotifyOnPlayPauseClick}
          onOpenSearch={() => onSearch("")}
        />
      </div>

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
