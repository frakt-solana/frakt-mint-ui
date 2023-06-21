import create from 'zustand';

type ViewState = 'table' | 'card';

interface TableViewState {
  viewState: ViewState;
  setViewState: (nextValue: ViewState) => void;
}

export const useTableView = create<TableViewState>((set) => ({
  viewState: 'table',
  setViewState: (nextValue) =>
    set((state) => ({ ...state, viewState: nextValue })),
}));
