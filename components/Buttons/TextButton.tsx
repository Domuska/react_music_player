import { PropsWithChildren } from "react";
import { BorderlessButton } from "../IconButtons/IconButtons";
import styled from "styled-components";

export const TextButton = ({
  children,
  onClick,
}: PropsWithChildren & { onClick: () => void }) => {
  return <Button onClick={onClick}>{children}</Button>;
};

const Button = styled(BorderlessButton)`
  font-weight: bold;
  color: ${({ theme }) => theme.colors.textOnMainBg};
  font-size: x-large;

  &:hover {
    cursor: pointer;
    text-decoration: underline var(--text-on-main-bg);
  }
`;
