import styled from "styled-components";
import { Search } from "./Search";

export const TopBar = () => {
  return (
    <Container>
      <Search />
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
