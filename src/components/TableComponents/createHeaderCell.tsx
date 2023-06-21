import { ColumnTitleProps } from 'antd/lib/table/interface';
import { HeaderCell } from './HeaderCell';

export const createHeaderCell = <T extends Record<string, any>>(
  column: ColumnTitleProps<T>,
  label: string,
  value: string,
  tooltipText?: string,
  hiddenSort = true,
  fixedLeft?: boolean,
) => (
  <HeaderCell
    column={column}
    label={label}
    value={value}
    tooltipText={tooltipText}
    hiddenSort={hiddenSort}
    fixedLeft={fixedLeft}
  />
);
