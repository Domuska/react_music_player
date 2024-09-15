import styled from "styled-components";
import { SearchIcon } from "../IconButtons/Icons";
import { useState } from "react";
import { DatasetButton, XButton } from "../IconButtons/IconButtons";

export const Search = () => {
  const [hasFocus, setHasFocus] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  return (
    <Container $hasFocus={hasFocus}>
      <SearchInputContainer>
        <Label htmlFor="searchbar">
          <SearchIcon />
        </Label>
        <SearchInput
          aria-label="Search"
          id="searchbar"
          type="search"
          autoComplete="off"
          onFocus={() => setHasFocus(true)}
          onBlur={() => setHasFocus(false)}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="What do you want to listen to?"
        />
      </SearchInputContainer>

      {searchQuery == "" ? (
        <>
          <DividerLine />
          <DatasetButton />
        </>
      ) : (
        <XButton onClick={() => setSearchQuery("")} />
      )}
    </Container>
  );
};

const Label = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  height: 100%;
`;

const SearchInput = styled.input<{ $hasFocus?: boolean }>`
  height: 100%;
  width: 100%;
  border: none;
  outline: none;
  background: none;
  font-size: large;
  color: var(--text-on-main-bg);

  /* hide the clear button from input, we have our own at home */
  &::-webkit-search-decoration,
  &::-webkit-search-cancel-button {
    appearance: none;
  }
`;

const Container = styled.div<{ $hasFocus?: boolean }>`
  padding: 10px;
  border-width: 2px;
  border-style: solid;
  border-color: ${(props) => (props.$hasFocus ? "white" : "none")};
  background-color: var(--main-bg-color);
  width: 500px;
  height: 100%;
  border-radius: 30px;
  display: flex;
  align-items: center;

  button {
    cursor: pointer;
  }

  svg {
    fill: ${(props) => (props.$hasFocus ? "var(--text-on-main-bg)" : "auto")};
    width: 30px;
    height: 30px;
  }

  &:hover {
    background-color: var(--highlight-element-color);
  }
`;

const SearchInputContainer = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 10;
  height: 100%;
  gap: 10px;

  & input:hover:not(:focus),
  & svg:hover {
    cursor: pointer;
  }

  &:hover svg {
    fill: white;
  }
`;

const DividerLine = styled.div`
  background-color: var(--diminished-text-color);
  width: 1px;
  height: 80%;
`;
