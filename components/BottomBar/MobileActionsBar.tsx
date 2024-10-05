import styled from "styled-components";
import { BorderlessButton } from "../IconButtons/IconButtons";
import { SearchIcon } from "../IconButtons/Icons";

export const MobileActionsBar = ({
  onOpenSearch,
}: {
  onOpenSearch: VoidFunction;
}) => {
  return (
    <Container>
      <SearchContainer>
        <Search onClick={onOpenSearch}>
          <SearchIcon size="36px" />
          <span>Search</span>
        </Search>
      </SearchContainer>
    </Container>
  );
};

const Search = styled(BorderlessButton)`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 48px;

  color: ${(props) => props.theme.colors.textOnMainBg};
  font-size: xx-small;
`;

const SearchContainer = styled.div`
  grid-area: search;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-areas: "home search library";
  padding: 10px;
  background-color: ${(props) => props.theme.colors.mainBgBlack};

  @media screen and (min-width: 1200px) {
    display: none;
  }
`;
