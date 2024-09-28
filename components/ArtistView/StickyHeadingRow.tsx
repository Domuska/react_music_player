import styled from "styled-components";
import { PlayPauseButton } from "../Buttons/PlayPauseButton";

export const StickyHeadingRow = ({
  onPlay,
  artistName,
}: {
  onPlay: VoidFunction;
  artistName: string;
}) => {
  return (
    <StickyContainer>
      {/* keep the button outside of the fade animation container, it is sticky so it stays visible always */}
      <PlayPauseButton
        isPaused={true}
        onClick={onPlay}
        colorVariant="mainAction"
        size="48px"
      />
      <FadeInContent>
        <p>{artistName}</p>
      </FadeInContent>
    </StickyContainer>
  );
};

// these two elements are tangled together, thanks to
// the absolute positioning and margins it requires to make the elements line up
// without absolute positioning, the button would reserve its' own space in the
// sticky heading.

// could we display: flex the button & text to the same line along with
// the stickiness?
// for some reason, the element doesn't span the whole parent width with flex.

const StickyContainer = styled.div`
  position: sticky;
  top: 0;
  z-index: 50;

  & button,
  p {
    /* keep the button & text aligned */
    position: absolute;
    margin-top: 10px;
  }

  & button {
    z-index: 101;
    margin-left: 10px;
  }

  & p {
    margin-left: 140px;
  }
`;

const FadeInContent = styled.div`
  background-color: ${(props) => props.theme.colors.mainBgBlack};
  animation-timeline: scroll();
  animation-name: fadein;
  height: 70px;

  & p {
    font-size: xx-large;
    font-weight: bold;
    color: ${(props) => props.theme.colors.textOnMainBg};
  }

  @keyframes fadein {
    /* keep the element hidden until 40% scrolled, around the height of the image & title */
    0%,
    40% {
      opacity: 0;
    }

    60% {
      opacity: 1;
    }
  }
`;
