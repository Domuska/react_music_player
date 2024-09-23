import styled from "styled-components";

const SliderWithBackground = styled.input<{ $sliderValue: number }>`
  /* removing default appearance */
  -webkit-appearance: none;
  appearance: none;
  /* creating a custom design */
  width: 100%;
  outline: none;
  border-radius: 16px;
  height: 6px;

  background: ${(props) =>
    `linear-gradient(to right, ${props.theme.colors.textOnMainBg} ${props.$sliderValue}%, ${props.theme.colors.mainBgColor} ${props.$sliderValue}%)`};

  &::-webkit-slider-thumb {
    /* removing default appearance */
    -webkit-appearance: none;
    appearance: none;
    /* creating a custom design */
    height: 15px;
    width: 15px;
    border-radius: 50%;
  }

  &::-moz-range-thumb {
    appearance: none;
    height: 0px;
    width: 0px;
    background-color: none;
    border-radius: 50%;
    border: none;
  }

  &:hover::-webkit-slider-thumb {
    background-color: white;
  }
  &:hover::-moz-range-thumb {
    background-color: white;
    height: 15px;
    width: 15px;
  }

  &:hover {
    background: ${(props) =>
      `linear-gradient(to right, ${props.theme.colors.mainActionColor} ${props.$sliderValue}%, ${props.theme.colors.mainBgColor} ${props.$sliderValue}%)`};
  }
`;

export const SliderInput = ({
  currentPercentageValue,
  onSeek,
}: {
  currentPercentageValue: number;
  onSeek: (param: number) => void;
}) => {
  const defaulted = currentPercentageValue ?? 0;

  const onChange = (value: string) => {
    const asInt = Number.parseInt(value, 10);
    onSeek(asInt);
  };

  return (
    <>
      <SliderWithBackground
        $sliderValue={defaulted}
        type="range"
        value={defaulted}
        max="100"
        min="0"
        step="1"
        onChange={(e) => onChange(e.target.value)}
      />
    </>
  );
};
