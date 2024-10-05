import styled from "styled-components";
import { SearchIcon } from "../IconButtons/Icons";
import { useState } from "react";
import { DatasetButton, XButton } from "../IconButtons/IconButtons";
import { useDebounce } from "../../utils/useDebounce";

type Props = {
  onSearch: (searchQuery: string) => void;
  colorTheme: "light" | "dark";
  displayBorder: boolean;
  displayDatasetButton: boolean;
};

export const Search = ({
  onSearch,
  colorTheme,
  displayBorder,
  displayDatasetButton,
}: Props) => {
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
    <Container
      $hasFocus={hasFocus}
      $colorTheme={colorTheme}
      $displayBorder={displayBorder}
    >
      <SearchInputContainer $colorTheme={colorTheme}>
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
          $colorTheme={colorTheme}
        />
      </SearchInputContainer>

      {searchQuery == "" ? (
        <>
          {displayDatasetButton && (
            <>
              <DividerLine $colorTheme={colorTheme} />
              <DatasetButton />
            </>
          )}
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

const SearchInput = styled.input<{
  $hasFocus?: boolean;
  $colorTheme: "light" | "dark";
}>`
  height: 100%;
  width: 100%;
  border: none;
  outline: none;
  background: none;
  font-size: large;
  color: ${(props) =>
    props.$colorTheme === "dark" ? props.theme.colors.textOnMainBg : "black"};

  /* hide the clear button from input, we have our own at home */
  &::-webkit-search-decoration,
  &::-webkit-search-cancel-button {
    appearance: none;
  }
`;

const Container = styled.div<{
  $hasFocus?: boolean;
  $colorTheme: "light" | "dark";
  $displayBorder: boolean;
}>`
  padding: 10px;
  border-width: 2px;
  border-style: ${(props) => (props.$displayBorder ? "solid" : "none")};
  border-color: ${(props) => (props.$hasFocus ? "white" : "auto")};

  background-color: ${(props) =>
    props.$colorTheme === "dark" ? props.theme.colors.mainBgColor : "white"};
  width: 500px;
  height: 100%;
  border-radius: 30px;
  display: flex;
  align-items: center;

  button {
    cursor: pointer;
  }

  svg {
    fill: ${(props) =>
      props.$hasFocus
        ? props.$colorTheme === "dark"
          ? props.theme.colors.textOnMainBg
          : "black"
        : props.$colorTheme === "dark"
          ? props.theme.colors.diminishedTextColor
          : "black"};
    width: 30px;
    height: 30px;
  }

  &:hover {
    background-color: ${(props) =>
      props.$colorTheme === "dark"
        ? props.theme.colors.highlightElementColor
        : "white"};
  }
`;

const SearchInputContainer = styled.div<{ $colorTheme: "light" | "dark" }>`
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
    fill: ${(props) => (props.$colorTheme === "dark" ? "white" : "black")};
  }
`;

const DividerLine = styled.div<{ $colorTheme: "light" | "dark" }>`
  background-color: var(--diminished-text-color);
  width: 1px;
  height: 80%;
`;
