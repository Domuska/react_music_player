import styled from "styled-components";
import { SliderInput } from "../SliderInput";
import { MutedButton, VolumeDownButton } from "../IconButtons/IconButtons";

export const VolumeControls = ({
  onVolumeChange,
  volumePercentage,
  onMuteClick,
  isMuted,
}: {
  onVolumeChange: (newVolumeFraction: number) => void;
  volumePercentage: number;
  onMuteClick: VoidFunction;
  isMuted: boolean;
}) => {
  const onSeek = (newPercentage: number) => {
    onVolumeChange(newPercentage);
  };

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
