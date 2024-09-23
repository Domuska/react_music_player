import styled from "styled-components";
import { PauseIcon, PlayIcon } from "../IconButtons/Icons";

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
    cursor: pointer;
  }
`;

type ColorVariant = "mainAction" | "white";

export const PlayPauseButton = ({
  isPaused,
  onClick,
  colorVariant,
}: {
  isPaused: boolean;
  onClick: () => void;
  colorVariant?: ColorVariant;
}) => {
  return (
    <StyledButton
      onClick={onClick}
      $bgColor={
        colorVariant == "mainAction" ? "var(--mainActionColor)" : undefined
      }
    >
      {isPaused ? <PlayIcon /> : <PauseIcon />}
    </StyledButton>
  );
};
