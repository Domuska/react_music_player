import styled from "styled-components";
import {SliderInput} from "./SliderInput";

const getWholeMinutesAndSeconds = (time: number) => {
	const currentProgressMinutes = Math.floor(time / 60);
	const leftSeconds = Math.floor(time % 60);
	return {minutes: currentProgressMinutes, seconds: leftSeconds};
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
	const formattedCurrentProgress = formattedCurrentMinutes + ":" + formattedCurrentSeconds;
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
	const formattedCurrentProgress = formatMinutesAndSecondsToDisplayString(currentFlooredTime);
	const totalFlooredTime = getWholeMinutesAndSeconds(totalPlaybackDuration);
	const formattedTotalTime = formatMinutesAndSecondsToDisplayString(totalFlooredTime);

	const currentPercentageValue =
		currentPlaybackTime && totalPlaybackDuration
			? (currentPlaybackTime / totalPlaybackDuration) * 100
			: 0;

	const onProgressUpdate = (percentage: number) => {
		const asFraction = percentage / 100;
		const newPosition = totalPlaybackDuration * asFraction;
		onSeek(newPosition);
	};

	return (
		<PlaybackContainer>
			<span>{formattedCurrentProgress}</span>

			<SliderInput currentPercentageValue={currentPercentageValue} onSeek={onProgressUpdate} />

			<span>{formattedTotalTime}</span>
		</PlaybackContainer>
	);
};
