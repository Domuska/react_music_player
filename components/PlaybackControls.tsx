import styled from "styled-components";
import styles from "./playbackControls.module.css";
import { ProgressBar } from "./ProgressBar";
import { SkipNextButton, SkipPreviousButton } from "./IconButtons/IconButtons";

const StyledButton = styled.button<{ $bgColor?: string }>`
  background-color: ${(props) => (props.$bgColor ? props.$bgColor : "white")};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
`;

const StyledPlayPauseButton = styled(StyledButton)`
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
    <StyledPlayPauseButton onClick={onClick}>
      {isPaused ? (
        <img src="/play_arrow_24dp.svg" />
      ) : (
        <img src="/pause_24dp.svg" />
      )}
    </StyledPlayPauseButton>
  );
};

// todo type children to react component / jsx
const ButtonWithoutBackground = ({ children }: { children: any }) => {
  return <StyledButton $bgColor="black">{children}</StyledButton>;
};

export const PlaybackControls = ({
  pausePlayOnclick,
  totalPlaybackDuration,
  currentPlaybackTime,
  isPlaybackPaused,
  onSeek,
}: {
  pausePlayOnclick: () => void;
  totalPlaybackDuration: React.ComponentProps<
    typeof ProgressBar
  >["totalPlaybackDuration"];
  currentPlaybackTime: React.ComponentProps<
    typeof ProgressBar
  >["currentPlaybackTime"];
  onSeek: React.ComponentProps<typeof ProgressBar>["onSeek"];
  isPlaybackPaused: boolean;
}) => {
  return (
    <div className={styles.playbackControls}>
      <div id="button-container" className={styles.buttonContainer}>
        <SkipPreviousButton />

        <PlayPauseButton
          onClick={pausePlayOnclick}
          isPaused={isPlaybackPaused}
        />

        <SkipNextButton />
      </div>
      <ProgressBar
        currentPlaybackTime={currentPlaybackTime}
        totalPlaybackDuration={totalPlaybackDuration}
        onSeek={onSeek}
      />
    </div>
  );
};
