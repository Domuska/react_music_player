import styled from "styled-components";
import { BorderlessButton } from "../IconButtons/IconButtons";

export const ClickableTitle = ({
  text,
  onClick,
}: {
  text: string;
  onClick?: VoidFunction;
}) => {
  return onClick ? (
    <ButtonTitle>
      <Text>{text}</Text>
    </ButtonTitle>
  ) : (
    <Text>{text}</Text>
  );
};

const Text = styled.span`
  font-weight: bold;
  font-size: x-large;
  font-size: 1.5rem;
  color: var(--text-on-main-bg);
`;

const ButtonTitle = styled(BorderlessButton)`
  display: flex;
  align-items: left;

  &:hover {
    cursor: pointer;
    text-decoration: underline var(--text-on-main-bg);
  }
`;
