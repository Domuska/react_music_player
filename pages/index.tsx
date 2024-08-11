"use client";

import styles from "../styles/Home.module.css";
import { useEffect, useRef, useState } from "react";
import { PlaybackControls } from "../components/PlaybackControls";

type Song = {
  songName: string;
  audioUri: string;
  imgUri?: string;
  songId: string;
};

const SongRow = ({
  song,
  setCurrentSong,
}: {
  song: Song;
  setCurrentSong: (param: string) => void;
}) => {
  return (
    <div>
      <button
        className={styles.playButton}
        onClick={() => setCurrentSong(song.songId)}
      >
        &#9658;
      </button>
      <span>{song.songName}</span>
    </div>
  );
};

const MusicList = ({
  songs,
  setCurrentSong,
}: {
  songs: Song[];
  setCurrentSong: React.ComponentProps<typeof SongRow>["setCurrentSong"];
}) => {
  return (
    <>
      {songs.map((song) => (
        <SongRow
          song={song}
          setCurrentSong={setCurrentSong}
          key={song.songId}
        />
      ))}
    </>
  );
};

export default function Home() {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
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
    const song = songs.find((s) => s.songId === songId);
    setCurrentSong(song);
  };

  const songs: Song[] = [
    {
      audioUri: "/alex-productions-action.mp3",
      imgUri: "/action.jfif",
      songName: "Action",
      songId: "1",
    },
    {
      audioUri: "/alex-productions-tension.mp3",
      imgUri: "/action.jfif",
      songName: "tension",
      songId: "2",
    },
  ];
  return (
    <div className={styles.gridContainer}>
      <audio
        id="music_player"
        ref={musicPlayer}
        src={currentSong?.audioUri}
        onTimeUpdate={() => onTimeUpdate(musicPlayer.current.currentTime)}
      />

      <span className={styles.searchNavBar}>searchi</span>
      <span className={styles.leftNav}>vasen nav</span>
      <span className={styles.mainContent}>
        <MusicList songs={songs} setCurrentSong={changeSong} />
      </span>
      <span className={styles.rightNav}>oikea nav</span>

      <span id="player-controls" className={`${styles.bottomCenter}`}>
        <PlaybackControls
          pausePlayback={() =>
            musicPlayer.current.paused ? playPlayback() : pausePlayback()
          }
          totalPlaybackDuration={
            musicPlayer.current?.duration ? musicPlayer.current.duration : null
          }
          currentPlaybackTime={currentPlaybackTime}
        />
      </span>

      {/* For styling the automatic padding & margin on the web page */}
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
