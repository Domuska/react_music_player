import styled from "styled-components";
import { BaseSyntheticEvent, SyntheticEvent, useRef, useState } from "react";

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
    `linear-gradient(to right, white ${props.$sliderValue}%, var(--main-bg-color) ${props.$sliderValue}%)`};

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
      `linear-gradient(to right, var(--mainActionColor) ${props.$sliderValue}%, var(--main-bg-color) ${props.$sliderValue}%)`};
  }
`;

export const SliderInput = ({
  currentValue,
  onSeek,
}: {
  currentValue: number;
  onSeek: (param: number) => void;
}) => {
  const defaulted = currentValue ?? 0;
  const slider = useRef<HTMLInputElement>();

  const onChange = (e: BaseSyntheticEvent) => {
    console.log(e);
    const val = e.target.value / 100;
    console.log(val);
    onSeek(val);
  };

  return (
    <>
      <SliderWithBackground
        ref={slider}
        $sliderValue={defaulted}
        type="range"
        value={defaulted}
        max="100"
        step="1"
        onChange={onChange}
      />
    </>
  );
};
