import styled from "styled-components";

const PlayArrow = ({ onClick }: { onClick: VoidFunction }) => {
  return (
    <svg
      onClick={() => onClick()}
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="var(--text-on-main-bg)"
    >
      <path d="M320-200v-560l440 280-440 280Zm80-280Zm0 134 210-134-210-134v268Z" />
    </svg>
  );
};

const Pause = ({ onClick }: { onClick: VoidFunction }) => {
  return (
    <svg
      onClick={() => onClick()}
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="#5f6368"
    >
      <path d="M520-200v-560h240v560H520Zm-320 0v-560h240v560H200Zm400-80h80v-400h-80v400Zm-320 0h80v-400h-80v400Zm0-400v400-400Zm320 0v400-400Z" />
    </svg>
  );
};

const StyledButton = styled.button`
  border: none;
  background: none;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const PlayPauseButton = ({
  playing,
  onPlay,
  onPause,
}: {
  playing: boolean;
  onPlay: VoidFunction;
  onPause: VoidFunction;
}) => {
  return (
    <StyledButton>
      {playing ? <Pause onClick={onPause} /> : <PlayArrow onClick={onPlay} />}
    </StyledButton>
  );
};
