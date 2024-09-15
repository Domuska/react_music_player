export const formatMinutesAndSecondsToDisplayString = ({
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

export const getWholeMinutesAndSeconds = (time: number) => {
  const currentProgressMinutes = Math.floor(time / 60);
  const leftSeconds = Math.floor(time % 60);
  return { minutes: currentProgressMinutes, seconds: leftSeconds };
};
