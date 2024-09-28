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
    <AnimationContainer className="animation-tracknumber-container">
      {displayAnimation ? <AnimatedPlayback /> : <>{text}</>}
    </AnimationContainer>
  );
};

export const TrackRow = ({
  track,
  playTrack,
  index,
  trackIsPlaying,
  onPlayPause,
  isPlaybackPaused,
  additionalColumns = [],
}: {
  track: Track;
  playTrack: (trackUri: string) => void;
  onPlayPause: VoidFunction;
  index: number;
  trackIsPlaying: boolean;
  isPlaybackPaused: boolean;
  additionalColumns?: string[];
}) => {
  const isRowPlaybackOngoing = trackIsPlaying && !isPlaybackPaused;

  const onPlayPauseClick = () => {
    if (trackIsPlaying) {
      onPlayPause();
    } else {
      playTrack(track.uri);
    }
  };

  return (
    <NoBorderTr $isRowActive={trackIsPlaying}>
      <TrackNumberTd>
        <TextOrPlayingAnimation
          displayAnimation={isRowPlaybackOngoing}
          text={index}
        />
        <PlayPauseButton
          onClick={onPlayPauseClick}
          playing={isRowPlaybackOngoing}
        />
      </TrackNumberTd>
      <TrackNameTd $isRowActive={trackIsPlaying}>
        <span>{track.name}</span>
      </TrackNameTd>
      {additionalColumns.map((str, index) => (
        <td key={index}>
          <span>{str}</span>
        </td>
      ))}
    </NoBorderTr>
  );
};

const TrackNumberTd = styled.td`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;
  /* so the on-hover play button doesn't make the row jump */
  min-height: 40px;
`;

const TrackNameTd = styled.td<{ $isRowActive?: boolean }>`
  color: ${(props) =>
    props.$isRowActive
      ? props.theme.colors.mainActionColor
      : props.theme.colors.textOnMainBg};
`;

const NoBorderTr = styled.tr<{ $isRowActive?: boolean }>`
  border: none;
  color: ${(props) =>
    props.$isRowActive ? props.theme.colors.mainActionColor : "unset"};

  /* highlight for the row */
  &:hover td {
    background-color: var(--highlight-element-color);
  }

  /* when hovering we display a button, otherwise let whatever is in tracknumber show*/
  &:hover td button {
    display: block;
  }

  &:not(:hover) td button,
  &:hover td .animation-tracknumber-container {
    display: none;
  }

  /* rounded borders */
  td:first-child {
    border-radius: 5px 0 0 5px;
  }
  td:last-child {
    border-radius: 0 5px 5px 0;
  }
`;

const AnimationContainer = styled.span`
  width: 80%;
  height: 30px;
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
`;
