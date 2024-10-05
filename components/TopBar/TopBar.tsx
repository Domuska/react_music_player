import styled from "styled-components";
import { Search } from "./Search";
import React from "react";

type Props = {
  onSearch: React.ComponentProps<typeof Search>["onSearch"];
};

export const TopBar = ({ onSearch }: Props) => {
  return (
    <Container>
      <Search
        onSearch={onSearch}
        colorTheme="dark"
        displayBorder
        displayDatasetButton
      />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 10px;
`;
