import styled from "styled-components";
import { SliderInput } from "../SliderInput";
import { MutedButton, VolumeDownButton } from "../IconButtons/IconButtons";

export const VolumeControls = ({
  onVolumeChange,
  currentVolumeFraction,
  onMuteClick,
  isMuted,
}: {
  onVolumeChange: (newVolumeFraction: number) => void;
  currentVolumeFraction: number;
  onMuteClick: VoidFunction;
  isMuted: boolean;
}) => {
  const onSeek = (newVal: number) => {
    const fraction = newVal / 100;
    onVolumeChange(fraction);
  };

  const volumePercentage = currentVolumeFraction * 100;

  return (
    <Container>
      {isMuted ? (
        <MutedButton onClick={onMuteClick} />
      ) : (
        <VolumeDownButton onClick={onMuteClick} />
      )}
      <SliderInput currentPercentageValue={volumePercentage} onSeek={onSeek} />
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 0 40px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
