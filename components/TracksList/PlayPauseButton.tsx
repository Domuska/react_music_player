import { PauseButton, PlayButton } from "../IconButtons/IconButtons";

export const PlayPauseButton = ({
  playing,
  onClick,
}: {
  playing: boolean;
  onClick: VoidFunction;
}) => {
  return (
    <>
      {playing ? (
        <PauseButton onClick={onClick} />
      ) : (
        <PlayButton onClick={onClick} />
      )}
    </>
  );
};
