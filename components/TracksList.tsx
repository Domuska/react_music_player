import styled from "styled-components";
import { Track } from "./types";

const TrackRow = ({
  track,
  setCurrentTrack,
  index,
}: {
  track: Track;
  setCurrentTrack: (param: string) => void;
  index: number;
}) => {
  return (
    <tr>
      <CenteredTd>{index}</CenteredTd>
      {/* todo display this button on hover */}
      {/* <button onClick={() => setCurrentTrack(track.id)}>&#9658;</button> */}
      <td>
        <span>{track.name}</span>
      </td>
      <td>albuminnimi</td>
      <td>3.14</td>
    </tr>
  );
};

const CenteredTd = styled.td`
  display: flex;
  justify-content: center;
`;

export const TracksList = ({
  tracks,
  setCurrentTrack,
}: {
  tracks: Track[];
  setCurrentTrack: React.ComponentProps<typeof TrackRow>["setCurrentTrack"];
}) => {
  return (
    <Container className="card">
      <TracksTable>
        <THead>
          <tr>
            <TrackNumberTh>#</TrackNumberTh>
            <HeaderTh>Title</HeaderTh>
            <HeaderTh>Album</HeaderTh>
            <HeaderTh>kelloikoni</HeaderTh>
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
              setCurrentTrack={setCurrentTrack}
              key={track.id}
              index={index}
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
`;
