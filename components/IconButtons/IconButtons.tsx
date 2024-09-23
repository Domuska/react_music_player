import styled from "styled-components";
import { PauseIcon, PlayIcon } from "./Icons";

export const BorderlessButton = styled.button`
  border: none;
  background: none;
`;

const StyledButton = styled.button`
  border: none;
  background: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  svg:hover {
    fill: white;
    transform: scale(1.05);
  }

  svg {
    fill: var(--diminished-text-color);
  }
`;

export const ClockButton = ({ onClick }: { onClick?: VoidFunction }) => {
  return (
    <StyledButton onClick={onClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="18px"
        viewBox="0 -960 960 960"
        width="18px"
      >
        <path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z" />
      </svg>
    </StyledButton>
  );
};

export const SkipNextButton = ({ onClick }: { onClick?: VoidFunction }) => {
  return (
    <StyledButton onClick={onClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
      >
        <path d="M660-240v-480h80v480h-80Zm-440 0v-480l360 240-360 240Zm80-240Zm0 90 136-90-136-90v180Z" />
      </svg>
    </StyledButton>
  );
};

export const SkipPreviousButton = ({ onClick }: { onClick?: VoidFunction }) => {
  return (
    <StyledButton onClick={onClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
      >
        <path d="M220-240v-480h80v480h-80Zm520 0L380-480l360-240v480Zm-80-240Zm0 90v-180l-136 90 136 90Z" />
      </svg>
    </StyledButton>
  );
};

export const PlayButton = ({ onClick }: { onClick?: VoidFunction }) => {
  return (
    <StyledButton onClick={onClick}>
      <PlayIcon />
    </StyledButton>
  );
};

export const PauseButton = ({ onClick }: { onClick?: VoidFunction }) => {
  return (
    <StyledButton onClick={onClick} id="pause-button">
      <PauseIcon />
    </StyledButton>
  );
};

export const VolumeDownButton = ({ onClick }: { onClick?: VoidFunction }) => {
  return (
    <StyledButton onClick={onClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="#5f6368"
      >
        <path d="M200-360v-240h160l200-200v640L360-360H200Zm440 40v-322q45 21 72.5 65t27.5 97q0 53-27.5 96T640-320ZM480-606l-86 86H280v80h114l86 86v-252ZM380-480Z" />
      </svg>
    </StyledButton>
  );
};

export const MutedButton = ({ onClick }: { onClick?: VoidFunction }) => {
  return (
    <StyledButton onClick={onClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="#5f6368"
      >
        <path d="M792-56 671-177q-25 16-53 27.5T560-131v-82q14-5 27.5-10t25.5-12L480-368v208L280-360H120v-240h128L56-792l56-56 736 736-56 56Zm-8-232-58-58q17-31 25.5-65t8.5-70q0-94-55-168T560-749v-82q124 28 202 125.5T840-481q0 53-14.5 102T784-288ZM650-422l-90-90v-130q47 22 73.5 66t26.5 96q0 15-2.5 29.5T650-422ZM480-592 376-696l104-104v208Zm-80 238v-94l-72-72H200v80h114l86 86Zm-36-130Z" />
      </svg>
    </StyledButton>
  );
};

export const XButton = ({ onClick }: { onClick?: VoidFunction }) => {
  return (
    <StyledButton onClick={onClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="#5f6368"
      >
        <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
      </svg>
    </StyledButton>
  );
};

export const DatasetButton = ({ onClick }: { onClick?: VoidFunction }) => {
  return (
    <StyledButton onClick={onClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="var(--text-on-main-bg)"
      >
        <path d="M280-280h160v-160H280v160Zm240 0h160v-160H520v160ZM280-520h160v-160H280v160Zm240 0h160v-160H520v160ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z" />
      </svg>
    </StyledButton>
  );
};
