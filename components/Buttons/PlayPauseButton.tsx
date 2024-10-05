import styled from "styled-components";
import { PauseIcon, PlayIcon } from "../IconButtons/Icons";

const StyledButton = styled.button<{
  $bgColor?: string;
  $size: "48px" | "32px";
}>`
  background-color: ${(props) => (props.$bgColor ? props.$bgColor : "white")};
  border-radius: 50%;
  min-width: ${(props) => props.$size};
  min-height: ${(props) => props.$size};
  max-width: ${(props) => props.$size};
  max-height: ${(props) => props.$size};
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
  size = "32px",
  className,
}: {
  isPaused: boolean;
  onClick: () => void;
  colorVariant?: ColorVariant;
  size?: "48px" | "32px";
  className?: string;
}) => {
  return (
    <StyledButton
      onClick={onClick}
      $bgColor={
        colorVariant == "mainAction" ? "var(--mainActionColor)" : undefined
      }
      $size={size}
      className={className}
    >
      {isPaused ? <PlayIcon /> : <PauseIcon />}
    </StyledButton>
  );
};
