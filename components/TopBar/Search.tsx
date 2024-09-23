import styled from "styled-components";
import { SearchIcon } from "../IconButtons/Icons";
import { useState } from "react";
import { DatasetButton, XButton } from "../IconButtons/IconButtons";
import { useDebounce } from "../../utils/useDebounce";

type Props = {
  onSearch: (searchQuery: string) => void;
};

export const Search = ({ onSearch }: Props) => {
  const [hasFocus, setHasFocus] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const debounceSearch = useDebounce(() => {
    onSearch(searchQuery);
  }, 500);

  const onChange = (e: React.FormEvent<HTMLInputElement>) => {
    setSearchQuery(e.currentTarget.value);
    debounceSearch();
  };

  const clearQuery = () => {
    setSearchQuery("");
    onSearch("");
  };

  const onFocus = () => {
    setHasFocus(true);

    // call onSearch so focus goes back go search screen
    if (searchQuery) {
      onSearch(searchQuery);
    }
  };

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
          onFocus={onFocus}
          onBlur={() => setHasFocus(false)}
          value={searchQuery}
          onChange={onChange}
          placeholder="What do you want to listen to?"
        />
      </SearchInputContainer>

      {searchQuery == "" ? (
        <>
          <DividerLine />
          <DatasetButton />
        </>
      ) : (
        <XButton onClick={clearQuery} />
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
