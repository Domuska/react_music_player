"use client";

import styles from "./layout.module.css";
import {
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Library } from "../../components/Library";
import SpotifyWebPlayback from "../../components/Spotify/SpotifyWebPlayback";
import { api } from "../../components/Spotify/SpotifyApi";
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
  SpotifyPlayerHandleContext,
} from "./context";
import { useRouter } from "next/navigation";
import { BottomBar } from "../../components/BottomBar/BottomBar";
import { Login } from "../../components/Login";

const ONE_SECOND = 1000;

const queryClient = new QueryClient();

export default function ({ children }: PropsWithChildren) {
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
  const [spotifyPlayerHandle, setSpotifyPlayerHandle] = useState(null);

  const context = useContext(SpotifyApiContext);
  const spotifyApiRef = context?.spotifyApiRef;
  const setSpotifyApiRef = context?.setSpotifyApiRef;

  useEffect(() => {
    const access_token = getCookieByName(ACCESS_TOKEN_COOKIE_NAME);
    setToken(access_token ?? "");
  }, []);

  // todo if we playback is not ongoing, no need to fetch data as often
  const { data: currentSpotifyData, refetch: refetchCurrentSpotifyData } =
    useQuery({
      queryKey: ["currentData"],
      queryFn: async () => {
        const response = await spotifyApiRef?.getPlaybackStatus();
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
    (playerId: string, sdkPlayerHandle: any) => {
      if (!setSpotifyApiRef) {
        return;
      }
      setSpotifyApiRef(api(token, playerId, sdkPlayerHandle));
      setSpotifyPlayerHandle(sdkPlayerHandle);
    },
    [setSpotifyApiRef, setSpotifyPlayerHandle, token]
  );

  if (!token) {
    return <Login />;
  }

  const spotifyOnPlayPauseClick = async () => {
    if (currentSpotifyData?.is_playing) {
      await spotifyApiRef?.pausePlayback();
    } else {
      await spotifyApiRef?.playPlayback();
    }
    // the API is fairly slow, if we call it immediately the playback status is not updated
    await sleep(500);
    refetchCurrentSpotifyData();
  };

  const onSeek = async (timeMs: number) => {
    await spotifyApiRef?.seek(timeMs);
    await sleep(700);
    refetchCurrentSpotifyData();
  };

  const onVolumeChange = async (newVolume: number) => {
    if (volumeState.isMuted) {
      setVolumeState({ isMuted: false, volumeBeforeMute: newVolume });
    }
    await spotifyApiRef?.setVolume(newVolume);
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

  console.log("hei maailma. Tässä layout, kuka siellä?");

  return (
    <div>
      {/* The Spotify playback component */}
      <SpotifyWebPlayback
        token={token}
        onPlayerReady={onSpotifyPlayerReady}
        onStateUpdate={onStateUpdate}
      />

      {/* provide the Spotify player handle to children if they need it */}
      <SpotifyPlayerHandleContext.Provider value={spotifyPlayerHandle}>
        <div className={styles.container}>
          <span className={styles.searchNavBar}>
            <TopBar onSearch={onSearch} />
          </span>

          <div className={styles.libraryNav}>
            <Library />
          </div>

          <div className={styles.mainContent}>
            {/* //useQuery does not seem to narrow down type, use nullish coalescing https://github.com/TanStack/query/discussions/1331 */}
            <CurrentPlaybackContext.Provider value={currentSpotifyData ?? null}>
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
            spotifyApiRef={spotifyApiRef ?? undefined}
            spotifyOnPlayPauseClick={spotifyOnPlayPauseClick}
            onOpenSearch={() => onSearch("")}
          />
        </div>
      </SpotifyPlayerHandleContext.Provider>
    </div>
  );
};
