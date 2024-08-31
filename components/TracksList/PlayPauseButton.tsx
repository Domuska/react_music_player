import { PauseButton, PlayButton } from "../IconButtons/IconButtons";

export const PlayPauseButton = ({
  playing,
  onPlay,
  onPause,
}: {
  playing: boolean;
  onPlay: VoidFunction;
  onPause: VoidFunction;
}) => {
  return (
    <>
      {playing ? (
        <PauseButton onClick={onPause} />
      ) : (
        <PlayButton onClick={onPlay} />
      )}
    </>
  );
};
