import styled from "styled-components";
import styles from "./playbackControls.module.css";
import { ProgressBar } from "./ProgressBar";
import { SkipNextButton, SkipPreviousButton } from "./IconButtons/IconButtons";
import { PromiseVoidFunction } from "./types";
import { PauseIcon, PlayIcon } from "./IconButtons/Icons";

const StyledButton = styled.button<{ $bgColor?: string }>`
  background-color: ${(props) => (props.$bgColor ? props.$bgColor : "white")};
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;

  & svg {
    fill: black;
  }

  &:hover {
    transform: scale(1.05);
  }
`;

const PlayPauseButton = ({
  isPaused,
  onClick,
}: {
  isPaused: boolean;
  onClick: () => void;
}) => {
  return (
    <StyledButton onClick={onClick}>
      {isPaused ? <PlayIcon /> : <PauseIcon />}
    </StyledButton>
  );
};

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
