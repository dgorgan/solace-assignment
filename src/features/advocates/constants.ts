export const DEFAULT_PAGE = 1 as const;
export const DEFAULT_PAGE_SIZE = 25 as const;
export const MAX_PAGE_SIZE = 100 as const;
export const SORTABLE_COLUMNS = ["lastName","city","yearsOfExperience"] as const;
export type SortColumn = typeof SORTABLE_COLUMNS[number];
export type SortDir = "asc" | "desc";
export const DEFAULT_SORT: SortColumn = "lastName";
export const DEFAULT_DIR: SortDir = "asc";
