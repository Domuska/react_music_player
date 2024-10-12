import { createContext } from "react";
import { SearchResponse } from "../../../components/types";

export type SearchResultContextType = {
  data: SearchResponse | null;
  loadMore?: VoidFunction;
  canFetchMore: boolean;
  isFetching: boolean;
};

export const SearchResultContext = createContext<SearchResultContextType>({
  data: null,
  canFetchMore: true,
  isFetching: false,
});
