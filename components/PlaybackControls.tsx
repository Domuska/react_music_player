import styles from "./playbackControls.module.css";
import { ProgressBar } from "./ProgressBar";
import { SkipNextButton, SkipPreviousButton } from "./IconButtons/IconButtons";
import { PromiseVoidFunction } from "./types";
import { PlayPauseButton } from "./Buttons/PlayPauseButton";

export const PlaybackControls = ({
  pausePlayOnclick,
  skipToNextOnClick,
  skipToPreviousOnClick,
  totalPlaybackDuration,
  currentPlaybackTime,
  isPlaybackPaused,
  onSeek,
}: {
  pausePlayOnclick: () => void;
  skipToNextOnClick: PromiseVoidFunction | undefined;
  skipToPreviousOnClick: PromiseVoidFunction | undefined;
  totalPlaybackDuration: React.ComponentProps<
    typeof ProgressBar
  >["totalPlaybackDurationMs"];
  currentPlaybackTime: React.ComponentProps<
    typeof ProgressBar
  >["currentPlaybackTimeMs"];
  onSeek: React.ComponentProps<typeof ProgressBar>["onSeek"];
  isPlaybackPaused: boolean;
}) => {
  return (
    <div className={styles.playbackControls}>
      <div id="button-container" className={styles.buttonContainer}>
        <SkipPreviousButton onClick={skipToPreviousOnClick} />

        <PlayPauseButton
          onClick={pausePlayOnclick}
          isPaused={isPlaybackPaused}
        />

        <SkipNextButton onClick={skipToNextOnClick} />
      </div>
      <ProgressBar
        currentPlaybackTimeMs={currentPlaybackTime}
        totalPlaybackDurationMs={totalPlaybackDuration}
        onSeek={onSeek}
      />
    </div>
  );
};
