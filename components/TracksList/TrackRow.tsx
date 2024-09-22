import { useState } from "react";
import { AnimatedPlayback } from "../../weird-components/AnimatedPlayback";
import { Track } from "../types";
import { PlayPauseButton } from "./PlayPauseButton";
import styled from "styled-components";

const TextOrPlayingAnimation = ({
  displayAnimation,
  text,
}: {
  displayAnimation: boolean;
  text: number;
}) => {
  return (
    <AnimationContainer>
      {displayAnimation ? <AnimatedPlayback /> : <>{text}</>}
    </AnimationContainer>
  );
};

export const TrackRow = ({
  track,
  playTrack,
  index,
  trackIsPlaying,
  pausePlayback,
  isPlaybackPaused,
  additionalColumns = [],
}: {
  track: Track;
  playTrack: (trackUri: string) => void;
  pausePlayback: VoidFunction;
  index: number;
  trackIsPlaying: boolean;
  isPlaybackPaused: boolean;
  additionalColumns?: string[];
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const onHover = () => {
    setIsHovered(true);
  };

  const onMouseLeave = () => {
    setIsHovered(false);
  };

  const isRowPlaybackOngoing = trackIsPlaying && !isPlaybackPaused;

  const onPlayPauseClick = () => {
    if (trackIsPlaying) {
      pausePlayback();
    } else {
      playTrack(track.uri);
    }
  };

  return (
    <NoBorderTr
      onMouseEnter={onHover}
      onMouseLeave={onMouseLeave}
      $isRowActive={trackIsPlaying}
    >
      <TrackNumberTd $hovered={isHovered}>
        {isHovered ? (
          <PlayPauseButton
            onClick={onPlayPauseClick}
            playing={isRowPlaybackOngoing}
          />
        ) : (
          <TextOrPlayingAnimation
            displayAnimation={isRowPlaybackOngoing}
            text={index}
          />
        )}
      </TrackNumberTd>
      <TrackNameTd $hovered={isHovered} $isRowActive={trackIsPlaying}>
        <span>{track.name}</span>
      </TrackNameTd>
      {additionalColumns.map((str, index) => (
        <HoverHighlightTd $hovered={isHovered} key={index}>
          {str}
        </HoverHighlightTd>
      ))}
    </NoBorderTr>
  );
};

// base component for setting opaque layer on hover
const HoverHighlightTd = styled.td<{ $hovered?: boolean }>`
  background-color: ${(props) =>
    props.$hovered ? "var(--highlight-element-color)" : "unset"};
`;

const TrackNumberTd = styled(HoverHighlightTd)`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;
  /* so the on-hover play button doesn't make the row jump */
  min-height: 40px;
`;

const TrackNameTd = styled(HoverHighlightTd)<{ $isRowActive?: boolean }>`
  // todo can the variables be accessed without writing a string here?
  color: ${(props) =>
    props.$isRowActive ? "var(--mainActionColor)" : "var(--text-on-main-bg)"};
`;

const NoBorderTr = styled.tr<{ $isRowActive?: boolean }>`
  border: none;
  color: ${(props) =>
    props.$isRowActive ? "var(--mainActionColor)" : "unset"};
`;

const AnimationContainer = styled.span`
  width: 80%;
  height: 30px;
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
`;
