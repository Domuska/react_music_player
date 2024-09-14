import styled from "styled-components";
import { Album, Track } from "../types";
import { useState } from "react";
import { PlayPauseButton } from "./PlayPauseButton";
import { ClockButton } from "../IconButtons/IconButtons";
import { AnimatedPlayback } from "../../weird-components/AnimatedPlayback";

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

const TrackRow = ({
  track,
  playTrack,
  index,
  trackIsPlaying,
  pausePlayback,
  isPlaybackPaused,
}: {
  track: Track;
  playTrack: (param: string) => void;
  pausePlayback: VoidFunction;
  index: number;
  trackIsPlaying: boolean;
  isPlaybackPaused: boolean;
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
      playTrack(track.id);
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
      <HoverHighlightTd $hovered={isHovered}>albuminnimi</HoverHighlightTd>
      <HoverHighlightTd $hovered={isHovered}>3.14</HoverHighlightTd>
    </NoBorderTr>
  );
};

export const TracksList = ({
  playTrack,
  currentlyPlayingTrackId,
  pausePlayback,
  isPlaybackPaused,
  album,
}: {
  album?: Album;
  playTrack: React.ComponentProps<typeof TrackRow>["playTrack"];
  currentlyPlayingTrackId?: string;
  pausePlayback: React.ComponentProps<typeof TrackRow>["pausePlayback"];
  isPlaybackPaused: boolean;
}) => {
  return (
    <Container className="card">
      <TracksTable>
        <THead>
          <tr>
            <TrackNumberTh scope="col">#</TrackNumberTh>
            <HeaderTh scope="col">Title</HeaderTh>
            <HeaderTh scope="col">Album</HeaderTh>
            <ClockHeaderTh scope="col">
              <ClockButton />
            </ClockHeaderTh>
          </tr>

          <tr>
            <DividerTh colSpan={5} />
          </tr>
        </THead>

        <tbody>
          {album &&
            album.tracks.items.map((track) => {
              return (
                <TrackRow
                  key={track.id}
                  index={track.track_number}
                  playTrack={playTrack}
                  isPlaybackPaused={isPlaybackPaused}
                  pausePlayback={pausePlayback}
                  track={track}
                  trackIsPlaying={track.id == currentlyPlayingTrackId}
                />
              );
            })}
        </tbody>
      </TracksTable>
    </Container>
  );
};

const Container = styled.div`
  /* todo this gradient isn't correct */
  /* the color gradient change should stop sooner and just be all gray after that */
  /* background: linear-gradient(#ad3c34 10%, 25%, var(--main-bg-color) 90%); */
  color: var(--diminished-text-color);
  padding: 20px;
  border-radius: 10px;
`;

const THead = styled.thead`
  position: sticky;
`;

const TrackNumberTh = styled.th`
  text-align: center;
  margin-right: 30px;
  width: 10%;
`;

const HeaderTh = styled.th`
  text-align: start;
  width: 45%;
`;

const ClockHeaderTh = styled.th`
  width: 10%;
`;

const TracksTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  table-layout: fixed;

  /* get rounded borders for the table */
  td:first-child {
    border-radius: 5px 0 0 5px;
  }
  td:last-child {
    border-radius: 0 5px 5px 0;
  }
`;

// base component for setting opaque layer on hover
const HoverHighlightTd = styled.td<{ $hovered?: boolean }>`
  background-color: ${(props) =>
    props.$hovered ? "rgba(255, 255, 255, 0.1)" : "unset"};
`;

// TODO https://styled-components.com/docs/advanced#style-objects
// could that be used to deal with the hover highlighting?

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

const DividerTh = styled.th`
  height: 1px;
  padding: 0px;
  background-color: #7e7d7d;
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
