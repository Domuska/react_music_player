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
  totalPlaybackDurationMs,
  currentPlaybackTimeMs,
  onSeek,
}: {
  totalPlaybackDurationMs: number | undefined;
  currentPlaybackTimeMs: number | undefined;
  onSeek: (timeMs: number) => Promise<void>;
}) => {
  const totalPlaybackSeconds = totalPlaybackDurationMs
    ? totalPlaybackDurationMs / 1000
    : 0;
  const currentPlaybackSeconds = currentPlaybackTimeMs
    ? currentPlaybackTimeMs / 1000
    : 0;
  const currentFlooredTime = getWholeMinutesAndSeconds(currentPlaybackSeconds);
  const formattedCurrentProgress =
    formatMinutesAndSecondsToDisplayString(currentFlooredTime);
  const totalFlooredTime = getWholeMinutesAndSeconds(totalPlaybackSeconds);
  const formattedTotalTime =
    formatMinutesAndSecondsToDisplayString(totalFlooredTime);

  const currentPercentageValue =
    currentPlaybackTimeMs && totalPlaybackDurationMs
      ? (currentPlaybackTimeMs / totalPlaybackDurationMs) * 100
      : 0;

  const onProgressUpdate = (percentage: number) => {
    const asFraction = percentage / 100;
    const newPosition = Math.round(totalPlaybackSeconds * asFraction * 1000);
    onSeek(newPosition);
  };

  return (
    <PlaybackContainer>
      <span>{formattedCurrentProgress}</span>

      <SliderInput
        currentPercentageValue={currentPercentageValue}
        onSeek={onProgressUpdate}
      />

      <span>{formattedTotalTime}</span>
    </PlaybackContainer>
  );
};
