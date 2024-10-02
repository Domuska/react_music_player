import styled from "styled-components";
import { SliderInput } from "./SliderInput";
import {
  formatMinutesAndSecondsToDisplayString,
  getWholeMinutesAndSeconds,
} from "../utils/timeUtils";

const PlaybackContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  color: #959aa3;
  width: 100%;
`;

export const ProgressBar = ({
  totalPlaybackDurationMs,
  currentPlaybackTimeMs,
  onSeek,
  displayTimeLabels = true,
}: {
  totalPlaybackDurationMs: number | undefined;
  currentPlaybackTimeMs: number | undefined;
  onSeek: (timeMs: number) => void;
  displayTimeLabels?: boolean;
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
      {displayTimeLabels && <span>{formattedCurrentProgress}</span>}

      <SliderInput
        currentPercentageValue={currentPercentageValue}
        onSeek={onProgressUpdate}
      />

      {displayTimeLabels && <span>{formattedTotalTime}</span>}
    </PlaybackContainer>
  );
};
