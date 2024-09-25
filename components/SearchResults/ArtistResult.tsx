import styled from "styled-components";
import { Artist } from "../types";
import { BorderlessButton } from "../IconButtons/IconButtons";
import { MultiplePeopleMicrophone } from "../IconButtons/Icons";
import { PlayPauseButton } from "../Buttons/PlayPauseButton";
import { useEffect, useMemo, useRef, useState } from "react";

export const ArtistsSearchResult = ({
  artists,
  onArtistClick,
  onArtistPlayClick,
  currentlyPlaying,
}: {
  artists: Artist[];
  onArtistClick: (artistId: string) => void;
  onArtistPlayClick: (uri: string) => void;
  currentlyPlaying: boolean;
}) => {
  const gridContainer = useRef<HTMLDivElement>(null);
  const [resizeWidth, setResizeWidth] = useState(0);
  const artistElementWidth = 140;

  useEffect(() => {
    if (gridContainer.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setResizeWidth(entry.contentRect.width);
        }
      });
      resizeObserver.observe(gridContainer.current);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, []);

  const visibleArtists = useMemo(() => {
    const result = artists.reduce<{ leftWidth: number; artists: Artist[] }>(
      (previousValue, current) => {
        if (previousValue.leftWidth > artistElementWidth) {
          previousValue.artists.push(current);
          previousValue.leftWidth -= artistElementWidth;
        }
        return previousValue;
      },
      {
        leftWidth: resizeWidth,
        artists: [],
      }
    );
    return result.artists;
  }, [artists, resizeWidth]);

  return (
    <>
      <Title>
        <span>Artists</span>
      </Title>
      <Grid
        ref={gridContainer}
        $visibleElements={visibleArtists.length}
        $imageWidthPx={artistElementWidth}
      >
        {visibleArtists.map((artist) => {
          const imageUrl =
            artist.images.length > 0
              ? artist.images[artist.images.length - 1].url
              : null;
          return (
            <ArtistContainer key={artist.id}>
              <ArtistButton onClick={() => onArtistClick(artist.id)}>
                {imageUrl ? (
                  <Image src={imageUrl} alt={artist.name + "image"} />
                ) : (
                  <MultiplePeopleMicrophone />
                )}

                <span>{artist.name}</span>
              </ArtistButton>

              <PlayButtonContainer className="play-button-container">
                <PlayPauseButton
                  isPaused={!currentlyPlaying}
                  onClick={() => onArtistPlayClick(artist.uri)}
                  colorVariant="mainAction"
                />
              </PlayButtonContainer>
            </ArtistContainer>
          );
        })}
      </Grid>
    </>
  );
};

const Title = styled(BorderlessButton)`
  &:hover {
    cursor: pointer;
    text-decoration: underline var(--text-on-main-bg);
  }

  & span {
    font-weight: bold;
    font-size: x-large;
    color: var(--text-on-main-bg);
  }
`;

const Grid = styled.div<{ $visibleElements: number; $imageWidthPx: number }>`
  display: grid;
  grid-template-columns: ${(props) =>
    `repeat(${props.$visibleElements}, ${props.$imageWidthPx}px)`};
  gap: 10px;
`;

const Image = styled.img`
  border-radius: 100%;
  object-fit: cover;
  aspect-ratio: 1;
  width: 100%;
`;

const ArtistContainer = styled.div`
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

const ArtistButton = styled(BorderlessButton)`
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
