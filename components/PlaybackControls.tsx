import styled from "styled-components";
import styles from "./playbackControls.module.css";
import { ProgressBar } from "./ProgressBar";

const SkipPreviousIcon = ({ fill }: { fill?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill={fill ? fill : "#FFFFFF"}
    >
      <path d="M220-240v-480h80v480h-80Zm520 0L380-480l360-240v480Zm-80-240Zm0 90v-180l-136 90 136 90Z" />
    </svg>
  );
};

const SkipNextIcon = ({ fill }: { fill?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill={fill ? fill : "#FFFFFF"}
    >
      <path d="M660-240v-480h80v480h-80Zm-440 0v-480l360 240-360 240Zm80-240Zm0 90 136-90-136-90v180Z" />
    </svg>
  );
};

const StyledButton = styled.button<{ $bgColor?: string }>`
  background-color: ${(props) => (props.$bgColor ? props.$bgColor : "white")};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;

  svg:hover {
    fill: white;
  }
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
  const imgSize = 24;
  return (
    <StyledPlayPauseButton onClick={onClick}>
      {isPaused ? (
        // <img width={imgSize} height={imgSize} src="/play_arrow_24dp.svg" />
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
  isPaused,
}: {
  pausePlayOnclick: () => void;
  totalPlaybackDuration: React.ComponentProps<
    typeof ProgressBar
  >["totalPlaybackDuration"];
  currentPlaybackTime: React.ComponentProps<
    typeof ProgressBar
  >["currentPlaybackTime"];
  isPaused: boolean;
}) => {
  return (
    <div className={styles.playbackControls}>
      <div id="button-container" className={styles.buttonContainer}>
        {/* <button>prev</button> */}
        <ButtonWithoutBackground>
          <SkipPreviousIcon fill="grey" />
        </ButtonWithoutBackground>

        <PlayPauseButton onClick={pausePlayOnclick} isPaused={isPaused} />

        <ButtonWithoutBackground>
          <SkipNextIcon fill="grey" />
        </ButtonWithoutBackground>
      </div>
      <ProgressBar
        currentPlaybackTime={currentPlaybackTime}
        totalPlaybackDuration={totalPlaybackDuration}
      />
    </div>
  );
};
