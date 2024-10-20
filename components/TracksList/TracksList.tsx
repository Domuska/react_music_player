import styled from "styled-components";
import { Track } from "../types";
import { ClockButton } from "../IconButtons/IconButtons";
import { TrackRow } from "./TrackRow";
import {
  formatMinutesAndSecondsToDisplayString,
  getWholeMinutesAndSeconds,
} from "../../utils/timeUtils";

export type DisplayMode = "album";

export const TracksList = ({
  playTrack,
  currentlyPlayingTrackId,
  onPlayPause,
  isPlaybackPaused,
  tracks,
  displayMode,
  isTracksListInPlaybackContext,
}: {
  displayMode: DisplayMode;
  tracks: Track[];
  playTrack: (trackUri: string) => any;
  currentlyPlayingTrackId?: string;
  onPlayPause: React.ComponentProps<typeof TrackRow>["onPlayPause"];
  isPlaybackPaused: boolean;
  // album, playlist, artist
  isTracksListInPlaybackContext: boolean;
}) => {
  const additionalColumns: string[] = [];
  if (displayMode === "album") {
    additionalColumns.push("plays");
  }

  // todo this component's heading count can change on different views, playlist view
  // has 4 columns. For that we need to make one of the columns stretch
  // https://christianalfoni.github.io/css/2013/06/23/css:-stretching-correctly-with-100%25.html
  // or just hard-code the two different cases with different number of columns
  // and column widths. Likely easier to hard-code, since there's only 2 well-known modes we will use.

  const getAdditionalColumns = (displayMode: DisplayMode, track: Track) => {
    if (displayMode === "album") {
      const durationSeconds = Math.floor(track.duration_ms / 1000);
      const minutesAndSeconds = getWholeMinutesAndSeconds(durationSeconds);
      const durationStr =
        formatMinutesAndSecondsToDisplayString(minutesAndSeconds);
      // we should return play count too, but it's not available on the API
      return ["", durationStr];
    }
  };

  const onPlayTrack = (trackUri: string) => {
    playTrack(trackUri);
  };

  return (
    <Container>
      <TracksTable>
        <THead>
          <tr>
            <TrackNumberTh scope="col">#</TrackNumberTh>
            <HeaderTh scope="col">Title</HeaderTh>
            <HeaderTh scope="col"></HeaderTh>
            <ClockHeaderTh scope="col">
              <ClockButton />
            </ClockHeaderTh>
          </tr>

          <tr>
            <DividerTh colSpan={5} />
          </tr>
        </THead>

        <tbody>
          {tracks.map((track, index) => {
            return (
              <TrackRow
                key={track.id}
                index={index + 1}
                playTrack={onPlayTrack}
                isPlaybackPaused={isPlaybackPaused}
                onPlayPause={onPlayPause}
                track={track}
                trackIsPlaying={
                  track.id == currentlyPlayingTrackId &&
                  isTracksListInPlaybackContext
                }
                additionalColumns={getAdditionalColumns(displayMode, track)}
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
`;

// TODO https://styled-components.com/docs/advanced#style-objects
// could that be used to deal with the hover highlighting?

const DividerTh = styled.th`
  height: 1px;
  padding: 0px;
  background-color: #7e7d7d;
`;
