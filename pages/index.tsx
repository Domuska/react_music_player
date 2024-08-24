"use client";

import styles from "../styles/Home.module.css";
import { useEffect, useRef, useState } from "react";
import { PlaybackControls } from "../components/PlaybackControls";
import { Track } from "../components/types";
import { TracksList } from "../components/TracksList";
import { Library } from "../components/Library";

export default function App() {
  const [currentSong, setCurrentSong] = useState<Track | null>(null);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState<number | null>(
    null
  );
  const musicPlayer = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (currentSong) {
      playPlayback();
    } else {
      pausePlayback();
    }
  }, [currentSong]);

  const pausePlayback = () => {
    musicPlayer.current.pause();
  };

  const playPlayback = () => {
    musicPlayer.current.play();
  };

  const onTimeUpdate = (currentTime: number) => {
    setCurrentPlaybackTime(currentTime);
  };

  const changeSong = (songId: string) => {
    console.log("setting song to ", songId);
    const song = songs.find((s) => s.id === songId);
    setCurrentSong(song);
  };

  const songs: Track[] = [
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
      <audio
        id="music_player"
        ref={musicPlayer}
        src={currentSong?.uri}
        onTimeUpdate={() => onTimeUpdate(musicPlayer.current.currentTime)}
      />

      <span className={styles.searchNavBar}>searchi</span>
      <div className={styles.leftNav}>
        <Library />
      </div>
      <div className={styles.mainContent}>
        <TracksList tracks={songs} setCurrentTrack={changeSong} />
      </div>
      <span className={styles.rightNav}>oikea nav</span>

      <span className={styles.bottomLeft}></span>
      <span className={styles.bottomRight}></span>

      <span id="player-controls" className={`${styles.bottomCenter}`}>
        <PlaybackControls
          pausePlayOnclick={() =>
            musicPlayer.current.paused ? playPlayback() : pausePlayback()
          }
          totalPlaybackDuration={
            musicPlayer.current?.duration ? musicPlayer.current.duration : null
          }
          currentPlaybackTime={currentPlaybackTime}
          isPaused={musicPlayer.current?.paused || currentSong === null}
        />
      </span>

      {/* For styling the automatic padding & margin on the whole web page */}
      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
