import styled from "styled-components";
import { Track } from "../types";
import { useState } from "react";
import { PlayPauseButton } from "./PlayPauseButton";
import { ClockButton } from "../IconButtons/IconButtons";

const TrackRow = ({
  track,
  playCurrentTrack,
  index,
  trackIsPlaying,
  pausePlayback,
  isPlaybackPaused,
}: {
  track: Track;
  playCurrentTrack: (param: string) => void;
  pausePlayback: VoidFunction;
  index: number;
  trackIsPlaying: boolean;
  isPlaybackPaused: boolean;
}) => {
  const [displayAction, setDisplayAction] = useState<boolean>(false);

  const onHover = () => {
    setDisplayAction(true);
  };

  const onMouseLeave = () => {
    setDisplayAction(false);
  };

  return (
    <tr onMouseEnter={() => onHover()} onMouseLeave={() => onMouseLeave()}>
      <TrackNumberTd>
        {displayAction ? (
          <PlayPauseButton
            onPause={pausePlayback}
            onPlay={() => playCurrentTrack(track.id)}
            playing={trackIsPlaying && !isPlaybackPaused}
          />
        ) : (
          index
        )}
      </TrackNumberTd>
      <TrackNameTd>
        <span>{track.name}</span>
      </TrackNameTd>
      <td>albuminnimi</td>
      <td>3.14</td>
    </tr>
  );
};

export const TracksList = ({
  tracks,
  playCurrentTrack,
  currentlyPlayingTrack,
  pausePlayback,
  isPlaybackPaused,
}: {
  tracks: Track[];
  playCurrentTrack: React.ComponentProps<typeof TrackRow>["playCurrentTrack"];
  currentlyPlayingTrack?: Track;
  pausePlayback: React.ComponentProps<typeof TrackRow>["pausePlayback"];
  isPlaybackPaused: boolean;
}) => {
  return (
    <Container className="card">
      <TracksTable>
        <THead>
          <tr>
            <TrackNumberTh>#</TrackNumberTh>
            <HeaderTh>Title</HeaderTh>
            <HeaderTh>Album</HeaderTh>
            <HeaderTh>
              <ClockButton />
            </HeaderTh>
          </tr>
          {/* row for displaying a border below header */}
          <tr>
            <th
              style={{
                height: "1px",
                padding: "0px",
                color: "black",
                backgroundColor: "black",
              }}
              colSpan={5}
            ></th>
          </tr>
        </THead>

        <tbody>
          {tracks.map((track, index) => (
            <TrackRow
              track={track}
              playCurrentTrack={playCurrentTrack}
              key={track.id}
              index={index + 1}
              trackIsPlaying={track.id === currentlyPlayingTrack?.id}
              pausePlayback={pausePlayback}
              isPlaybackPaused={isPlaybackPaused}
            />
          ))}
        </tbody>
      </TracksTable>
    </Container>
  );
};

const Container = styled.div`
  /* todo this gradient isn't correct */
  /* the color gradient change should stop sooner and just be all gray after that */
  background: linear-gradient(#ad3c34 10%, 25%, var(--main-bg-color) 90%);
  height: 100%;
  /* color: var(--text-on-main-bg); */
  color: var(--diminished-text-color);
`;

const THead = styled.thead`
  position: sticky;
`;

const TrackNumberTh = styled.th`
  text-align: center;
`;

const HeaderTh = styled.th`
  text-align: start;
`;

const TracksTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
`;

const TrackNumberTd = styled.td`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;
  /* so the on-hover play button doesn't make the row jump */
  min-width: 40px;
  min-height: 40px;
`;

const TrackNameTd = styled.td`
  color: var(--text-on-main-bg);
`;
