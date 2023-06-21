import { DebouncedFunc, get } from 'lodash';

import { TableProps, TablePropsWithSortProps } from './../Table';
import { useSortDropdownModal } from '../hooks';
import { PartialSearchParams } from '../types';
import { useSearch } from './useSearch';

type Event = { target: { value: string } };

interface UseTableProps<T> extends TableProps<T> {
  searchParams?: PartialSearchParams;
}

type UseTable = <T>(props: UseTableProps<T>) => {
  table: TablePropsWithSortProps<T>;
  search: {
    placeHolderText?: string;
    onChange: DebouncedFunc<(event: Event) => void>;
  };
};

export const useTable: UseTable = ({
  data,
  columns,
  onRowClick,
  rowKeyField = 'id',
  loading,
  defaultField,
  filterField,
  searchParams = {
    debounceWait: 0,
    searchField: 'name',
    placeHolderText: 'Search by name',
  },
}) => {
  const { filteredData, onChange } = useSearch({
    data,
    searchField: get(searchParams, 'searchField', 'name'),
    debounceWait: get(searchParams, 'debounceWait', 0),
  });

  const {
    modal: sortDropdownModal,
    sortedData,
    setIsToggleChecked,
    isToggleChecked,
  } = useSortDropdownModal({
    data: filteredData,
    columns,
    defaultField,
    filterField,
  });

  const search = {
    placeHolderText: get(searchParams, 'placeHolderText', 'Search by name'),
    onChange,
  };

  const table = {
    data: sortedData,
    columns,
    onRowClick,
    rowKeyField,
    loading,
    setIsToggleChecked,
    isToggleChecked,
    ...sortDropdownModal,
  };

  return { table, search };
};
