import styles from "./playbackControls.module.css";
import { ProgressBar } from "./ProgressBar";

export const PlaybackControls = ({
  pausePlayback,
  totalPlaybackDuration,
  currentPlaybackTime,
}: {
  pausePlayback: () => void;
  totalPlaybackDuration: React.ComponentProps<
    typeof ProgressBar
  >["totalPlaybackDuration"];
  currentPlaybackTime: React.ComponentProps<
    typeof ProgressBar
  >["currentPlaybackTime"];
}) => {
  return (
    <div className={styles.playbackControls}>
      <div id="button-container" className={styles.buttonContainer}>
        <button>prev</button>
        <button onClick={() => pausePlayback()}>Staph/go</button>
        <button>next</button>
      </div>
      <ProgressBar
        currentPlaybackTime={currentPlaybackTime}
        totalPlaybackDuration={totalPlaybackDuration}
      />
    </div>
  );
};
