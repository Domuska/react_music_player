import styled from "styled-components";
import { Image } from "./types";
import { BorderlessButton } from "./IconButtons/IconButtons";
import { MultiplePeopleMicrophone } from "./IconButtons/Icons";
import React, { useState } from "react";
import { useCalculateElementsThatFit } from "../utils/useCalculateItemsThatFit";
import { ClickableTitle } from "./ClickableTitle";
import Link from "next/link";

type PropItem = {
  images: Image[];
  id: string;
  name: string;
  uri: string;
  PlayButton?: () => JSX.Element;
  onClick: VoidFunction;
};

export const HorizontalItemContainer = ({
  items,
  variant = "round",
  title,
}: {
  items: PropItem[];
  variant?: "square" | "round";
  title: {
    text: string;
    onClick?: VoidFunction;
  };
}) => {
  const [gridRef, setGridRef] = useState<HTMLDivElement | null>(null);
  const gridGapPx = 10;
  const itemWidthPx = 125;
  const showMoreButtonWidthPx = 50;

  const visibleItems = useCalculateElementsThatFit({
    containingElement: gridRef,
    items: items,
    itemWidth: itemWidthPx + gridGapPx, // item will need the gap space too, calculate that in
    gutterWidth: showMoreButtonWidthPx,
  });

  return (
    <Container>
      <ClickableTitle text={title.text} onClick={title.onClick} />
      <Grid
        ref={(newRef) => setGridRef(newRef)}
        $visibleElements={visibleItems.length + 1}
        $itemWidthPx={itemWidthPx}
        $gap={gridGapPx}
      >
        {visibleItems.map(({ PlayButton, ...rest }) => {
          const imageUrl = rest.images.length > 0 ? rest.images[0].url : null;
          return (
            <ItemContainer key={rest.id}>
              <ItemButton onClick={rest.onClick}>
                {imageUrl ? (
                  <Img
                    src={imageUrl}
                    alt={rest.name + "image"}
                    $variant={variant}
                  />
                ) : (
                  <MultiplePeopleMicrophone />
                )}

                <span>{rest.name}</span>
              </ItemButton>

              <PlayButtonContainer className="play-button-container">
                {PlayButton && <PlayButton />}
              </PlayButtonContainer>
            </ItemContainer>
          );
        })}

        <ShowMoreLink href="/" $width={`${showMoreButtonWidthPx}px`}>
          Show more
        </ShowMoreLink>
      </Grid>
    </Container>
  );
};

const ShowMoreLink = styled(Link)<{ $width: string }>`
  width: ${({ $width }) => $width};
  color: ${({ theme }) => theme.colors.textOnMainBg};
  align-self: center;
  font-weight: bold;

  &:hover {
    cursor: pointer;
    text-decoration: underline var(--text-on-main-bg);
  }
`;

const Grid = styled.div<{
  $visibleElements: number;
  $itemWidthPx: number;
  $gap: number;
}>`
  display: grid;
  grid-template-columns: ${(props) =>
    `repeat(${props.$visibleElements}, ${props.$itemWidthPx}px)`};
  gap: ${({ $gap }) => `${$gap}px`};
`;

const Img = styled.img<{ $variant: "square" | "round" }>`
  border-radius: ${(props) => (props.$variant == "round" ? "100%" : "4px")};
  object-fit: cover;
  aspect-ratio: 1;
  width: 100%;
`;

const ItemContainer = styled.div`
  position: relative;
  border-radius: 5px;

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

const PlayButtonContainer = styled.div`
  position: absolute;
  bottom: 33%;
  right: 10%;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
