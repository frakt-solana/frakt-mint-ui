import { useMemo, useState } from 'react';
import { get, filter, some, isArray, isEmpty, isObject } from 'lodash';

import { ColumnsType } from 'antd/es/table';

import { SortDropdownProps } from '../components/SortDropdown';

type UseSortDropdownModal = <T>(props: {
  data: ReadonlyArray<T>;
  columns: ColumnsType<T>;
  defaultField?: string;
  filterField?: string | string[];
}) => {
  modal: SortDropdownProps<T>;
  sortedData: T[];
  isToggleChecked?: boolean;
  setIsToggleChecked?: (value?: boolean) => void;
};

export const useSortDropdownModal: UseSortDropdownModal = ({
  data,
  columns,
  defaultField,
  filterField,
}) => {
  const [isToggleChecked, setIsToggleChecked] = useState<boolean>(false);

  const [sort, setSort] = useState<{
    field: string | null;
    direction: 'desc' | 'asc';
  }>({
    field: defaultField || null,
    direction: 'desc',
  });

  const filteredData = useMemo(() => {
    if (!isToggleChecked || !filterField) {
      return data;
    }

    const filterFields = isArray(filterField) ? filterField : [filterField];

    return data.filter((item) =>
      filterFields.some((field) => {
        const fieldValue = get(item, field);

        if (isObject(fieldValue)) {
          return !!fieldValue[filterFields.at(-1)];
        }

        return !!fieldValue;
      }),
    );
  }, [data, filterField, isToggleChecked]);

  const sortedData = useMemo(() => {
    if (!sort.field) return filteredData;

    const sortFunction = columns.find(({ key }) => String(key) === sort.field)
      ?.sorter as any;

    if (!sortFunction) return filteredData;
    const sortedData = [...filteredData].sort(sortFunction);

    if (sort.direction === 'desc') {
      return sortedData.reverse();
    }

    return sortedData;
  }, [sort, columns, filteredData]) as [];

  return {
    modal: {
      sort,
      setSort,
      columns,
    },
    sortedData,
    setIsToggleChecked,
    isToggleChecked,
  };
};
