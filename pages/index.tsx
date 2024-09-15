"use client";

import styles from "../styles/Home.module.css";
import { useEffect, useRef, useState } from "react";
import { PlaybackControls } from "../components/PlaybackControls";
import {
  SimplifiedArtist,
  SpotifyDevice,
  SpotifyTrackItem,
  LegacyTrack,
  Album,
} from "../components/types";
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

const ONE_SECOND = 1000;

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

export default function App() {
  const [volumeState, setVolumeState] = useState<{
    isMuted: boolean;
    volumeBeforeMute: number;
  }>({ isMuted: false, volumeBeforeMute: 0 });

  const [isSpotifyPlaying, setIsSpotifyPlaying] = useState<boolean>(false);

  const [currentAlbumData, setCurrentAlbumData] = useState<Album | undefined>();

  const [currentSpotifyItem, setCurrentSpotifyItem] = useState<
    SpotifyTrackItem | undefined
  >();
  const [currentSpotifyDevice, setCurrentSpotifyDevice] = useState<
    SpotifyDevice | undefined
  >();
  const [currentPlaybackDurationMs, setCurrentPlaybackDurationMs] = useState<
    number | undefined
  >();

  const [token, setToken] = useState<string>("");

  const spotifyApiRef = useRef<SpotifyAPi | undefined>();

  // todo jos ei soiteta musiikkia ni voitas fetchailla paljon harvemmin dataa

  useEffect(() => {
    const access_token = getCookieByName(ACCESS_TOKEN_COOKIE_NAME);
    setToken(access_token ?? "");

    if (access_token) {
      spotifyApiRef.current = api(token);
      refreshSpotifyData(spotifyApiRef.current);

      const refreshDataInterval = setInterval(
        () => refreshSpotifyData(spotifyApiRef.current),
        ONE_SECOND
      );

      return () => {
        clearInterval(refreshDataInterval);
      };
    }
  }, [token]);

  const refreshSpotifyData = async (apiObject?: SpotifyAPi) => {
    if (!apiObject) {
      return;
    }

    try {
      const response = await apiObject.getPlaybackStatus();

      if (response && response.currently_playing_type == "track") {
        setIsSpotifyPlaying(response.is_playing);
        setCurrentSpotifyItem(response.item);
        setCurrentPlaybackDurationMs(response.progress_ms);
        setCurrentSpotifyDevice(response.device);
      } else {
        console.log(
          "response currently playing type is " +
            response?.currently_playing_type +
            ". Not supported yet."
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!token) {
    return <Login />;
  }

  const spotifyOnPlayPauseClick = async () => {
    if (isSpotifyPlaying) {
      await spotifyApiRef.current?.pausePlayback();
    } else {
      await spotifyApiRef.current?.playPlayback();
    }
    // the API is fairly slow, if we call it immediately the playback status is not updated
    await sleep(500);
    refreshSpotifyData(spotifyApiRef.current);
  };

  const changeSong = (trackId: string) => {
    console.log("todo play spotify api", trackId);
  };

  const onArtistClick = (artist: SimplifiedArtist) => {
    console.log("onArtistClick", artist);
    // todo something
  };

  const openAlbumData = async (albumId: string) => {
    const result = await spotifyApiRef.current?.fetchAlbum(albumId);
    setCurrentAlbumData(result);
  };

  const onSeek = async (timeMs: number) => {
    await spotifyApiRef.current?.seek(timeMs);
    await sleep(700);
    refreshSpotifyData(spotifyApiRef.current);
  };

  const onVolumeChange = async (newVolume: number) => {
    if (volumeState.isMuted) {
      setVolumeState({ isMuted: false, volumeBeforeMute: newVolume });
    }
    await spotifyApiRef.current?.setVolume(newVolume);
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
        volumeBeforeMute: currentSpotifyDevice?.volume_percent ?? 25,
      });
    }
  };

  const songs: LegacyTrack[] = [
    {
      uri: "/alex-productions-action.mp3",
      imgUri: "/action.jfif",
      name: "Action",
      id: "1",
    },
    {
      uri: "/alex-productions-tension.mp3",
      imgUri: "/action.jfif",
      name: "tension",
      id: "2",
    },
  ];

  return (
    <div className={styles.gridContainer}>
      {/* The Spotify playback component */}
      <SpotifyWebPlayback token={token} />

      <span className={styles.searchNavBar}>
        <TopBar />
      </span>
      <div className={styles.leftNav}>
        <Library />
      </div>
      <div className={styles.mainContent}>
        {currentAlbumData && spotifyApiRef.current && (
          <TracksList
            displayMode="album"
            tracks={currentAlbumData.tracks.items}
            playTrack={changeSong}
            currentlyPlayingTrackId={currentSpotifyItem?.id}
            isPlaybackPaused={!isSpotifyPlaying}
            pausePlayback={spotifyOnPlayPauseClick}
          />
        )}
      </div>
      <span className={styles.rightNav}>oikea nav</span>

      <span className={styles.bottomGrid}>
        <CurrentPlaybackInfo
          album={currentSpotifyItem?.album}
          trackTitle={currentSpotifyItem?.name}
          artists={currentSpotifyItem?.artists}
          onArtistClick={onArtistClick}
          onTrackClick={openAlbumData}
        />

        <PlaybackControls
          pausePlayOnclick={spotifyOnPlayPauseClick}
          skipToNextOnClick={spotifyApiRef.current?.skipToNext}
          skipToPreviousOnClick={spotifyApiRef.current?.skipToPrevious}
          totalPlaybackDuration={currentSpotifyItem?.duration_ms}
          currentPlaybackTime={currentPlaybackDurationMs}
          isPlaybackPaused={!isSpotifyPlaying}
          onSeek={onSeek}
        />

        <VolumeControls
          onVolumeChange={onVolumeChange}
          volumePercentage={currentSpotifyDevice?.volume_percent ?? 0}
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
}
