import styled from "styled-components";
import { Image } from "./types";
import React, { useState } from "react";
import { useCalculateElementsThatFit } from "../utils/useCalculateItemsThatFit";
import { ClickableTitle } from "./ClickableTitle";
import Link from "next/link";
import { PlayableItem } from "./PlayableItem";

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
  openMoreUri,
}: {
  items: PropItem[];
  variant?: "square" | "round";
  title: {
    text: string;
    onClick?: VoidFunction;
  };
  openMoreUri?: string;
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
            <PlayableItem
              key={rest.id}
              PlayButton={PlayButton}
              imageUrl={imageUrl}
              name={rest.name}
              onClick={rest.onClick}
              variant={variant}
            />
          );
        })}

        {openMoreUri && (
          <ShowMoreLink
            href={openMoreUri}
            $width={`${showMoreButtonWidthPx}px`}
          >
            Show more
          </ShowMoreLink>
        )}
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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
