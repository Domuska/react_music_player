import styled from "styled-components";
import { BorderlessButton } from "./IconButtons/IconButtons";
import { MultiplePeopleMicrophone } from "./IconButtons/Icons";

export const PlayableItem = ({
  onClick,
  name,
  PlayButton,
  imageUrl,
  variant,
}: {
  onClick: VoidFunction;
  name: string;
  PlayButton?: () => JSX.Element;
  imageUrl: string | null;
  variant: "square" | "round";
}) => {
  return (
    <ItemContainer>
      <ItemButton onClick={onClick}>
        {imageUrl ? (
          <Img src={imageUrl} alt={name + "image"} $variant={variant} />
        ) : (
          <MultiplePeopleMicrophone />
        )}

        <span>{name}</span>
      </ItemButton>

      <PlayButtonContainer className="play-button-container">
        {PlayButton && <PlayButton />}
      </PlayButtonContainer>
    </ItemContainer>
  );
};

const PlayButtonContainer = styled.div`
  position: absolute;
  bottom: 33%;
  right: 10%;
`;

const Img = styled.img<{ $variant: "square" | "round" }>`
  border-radius: ${(props) => (props.$variant == "round" ? "100%" : "4px")};
  object-fit: cover;
  aspect-ratio: 1;
  width: 100%;
`;

const ItemContainer = styled.div`
  position: relative;
  border-radius: 15px;

  &:hover {
    background-color: var(--highlight-element-color);
  }

  &:hover .play-button-container {
    animation: fade-in 0.3s ease-in forwards;
    animation: slide-up 0.3s;
  }

  &:not(:hover) .play-button-container {
    animation: fade-out 0.3s ease-out forwards;
  }

  /* animations */
  @keyframes fade-in {
    100% {
      opacity: 1;
      display: block;
    }

    0% {
      opacity: 0;
      display: none;
    }
  }

  @keyframes fade-out {
    100% {
      opacity: 0;
      display: none;
    }

    0% {
      opacity: 1;
      display: block;
    }
  }

  @keyframes slide-up {
    from {
      translate: 0 10px;
    }

    to {
      translate: 0 0;
    }
  }
`;

const ItemButton = styled(BorderlessButton)`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
  padding: 10px;

  &:hover {
    cursor: pointer;
  }

  & span {
    font-weight: bold;
    font-size: small;
    color: var(--text-on-main-bg);
    text-align: start;
  }
`;
