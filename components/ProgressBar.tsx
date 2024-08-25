import styled from "styled-components";
import { SliderInput } from "./SliderInput";

const getWholeMinutesAndSeconds = (time: number) => {
  const currentProgressMinutes = Math.floor(time / 60);
  const leftSeconds = Math.floor(time % 60);
  return { minutes: currentProgressMinutes, seconds: leftSeconds };
};

const PlaybackContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  color: #959aa3;
  width: 100%;
`;

const Progress = styled.progress`
  border-radius: 7px;
  height: 6px;
  width: 70%;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.2);

  &::-webkit-progress-bar {
    background-color: #615e55;
    border-radius: 7px;
  }

  &::-webkit-progress-value {
    background-color: white;
    border-radius: 7px;
  }
`;

const formatMinutesAndSecondsToDisplayString = ({
  minutes,
  seconds,
}: {
  minutes: number;
  seconds: number;
}) => {
  const formattedCurrentMinutes = `${minutes}`.padStart(1, "0");
  const formattedCurrentSeconds = `${seconds}`.padStart(2, "0");
  const formattedCurrentProgress =
    formattedCurrentMinutes + ":" + formattedCurrentSeconds;
  return formattedCurrentProgress;
};

export const ProgressBar = ({
  totalPlaybackDuration,
  currentPlaybackTime,
  onSeek,
}: {
  totalPlaybackDuration: number | null;
  currentPlaybackTime: number | null;
  onSeek: (param: number) => void;
}) => {
  const currentFlooredTime = getWholeMinutesAndSeconds(currentPlaybackTime);
  const formattedCurrentProgress =
    formatMinutesAndSecondsToDisplayString(currentFlooredTime);
  const totalFlooredTime = getWholeMinutesAndSeconds(totalPlaybackDuration);
  const formattedTotalTime =
    formatMinutesAndSecondsToDisplayString(totalFlooredTime);

  const onProgressUpdate = (percentage: number) => {
    const newPosition = totalPlaybackDuration * percentage;
    console.log(newPosition);
    onSeek(newPosition);
  };

  return (
    <PlaybackContainer>
      <span>{formattedCurrentProgress}</span>
      {/* <Progress value={currentPlaybackTime} max={totalPlaybackDuration} /> */}
      <SliderInput
        currentValue={currentPlaybackTime}
        onSeek={onProgressUpdate}
      />
      <span>{formattedTotalTime}</span>
    </PlaybackContainer>
  );
};
