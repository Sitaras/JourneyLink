import {
  parseAsInteger,
  useQueryStates,
} from "nuqs";

const paginationParsers = {
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
};
const paginationUrlKeys = {
  page: "page",
  limit: "limit",
};

export function usePaginationSearchParams() {
  return useQueryStates(paginationParsers, {
    urlKeys: paginationUrlKeys
  });
}
