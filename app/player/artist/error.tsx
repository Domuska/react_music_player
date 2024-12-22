"use client";

import styled from "styled-components";
import { TextButton } from "../../../components/Buttons/TextButton";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error(error);
  return (
    <ErrorContainer>
      <h2></h2>
      <TextButton onClick={reset}>
        <p>Something went wrong</p>
        <p>Click to reload</p>
      </TextButton>
    </ErrorContainer>
  );
}

const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;

  color: ${(props) => props.theme.colors.textOnMainBg};
`;
