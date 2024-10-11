import { createContext } from "react";
import { SearchResponse } from "../../../components/types";

export const SearchResultContext = createContext<{
  data: SearchResponse | null;
}>({
  data: null,
});

type loadMoreContext = {
  loadMore?: VoidFunction;
  canFetchMore: boolean;
  isFetching: boolean;
};

export const LoadMoreContext = createContext<loadMoreContext>({
  canFetchMore: true,
  isFetching: false,
});
