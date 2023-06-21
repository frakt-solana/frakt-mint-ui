interface Breakpoints {
  mobile: number;
  scrollX: number;
  scrollY: number;
}
export type PartialBreakpoints = Partial<Breakpoints>;

interface SearchParams {
  searchField: string | string[];
  debounceWait: number;
  placeHolderText: string;
}
export type PartialSearchParams = Partial<SearchParams>;

export interface ActiveRowParams {
  field?: string;
  value?: any;
  className?: string;
  cardClassName?: string;
}

export interface ViewParams {
  showCard: boolean;
  showSorting: boolean;
  showSearching: boolean;
  showToggle?: boolean;
}

export interface SelectLoansParams {
  onChange: () => void;
  selected: boolean;
}

export interface Sort {
  field: string | null;
  direction: 'desc' | 'asc';
}
