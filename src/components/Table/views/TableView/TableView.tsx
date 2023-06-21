import { Table as AntdTable } from 'antd';
import classNames from 'classnames';
import { ColumnsType } from 'antd/es/table';

import { ActiveRowParams, PartialBreakpoints } from '../../types';
import { getCardOrRowClassName } from '../../helpers';

import styles from './TableView.module.scss';

interface TableViewProps<T> {
  data: ReadonlyArray<T>;
  columns: ColumnsType<T>;
  onRowClick?: (dataItem: T) => void;
  rowKeyField?: string;
  loading?: boolean;
  className?: string;
  activeRowParams?: ActiveRowParams;
  breakpoints?: PartialBreakpoints;
}

const TableView = <T extends unknown>({
  data,
  className,
  activeRowParams,
  rowKeyField,
  loading,
  columns,
  onRowClick,
  breakpoints,
}: TableViewProps<T>) => {
  return (
    <AntdTable
      className={classNames(className, {
        [styles.noDataTableMessage]: !data.length && !loading,
      })}
      rowClassName={(record) => getCardOrRowClassName(record, activeRowParams)}
      columns={columns as ColumnsType}
      dataSource={data as any}
      pagination={false}
      sortDirections={['descend', 'ascend']}
      style={onRowClick && { cursor: 'pointer' }}
      rowKey={(data) => data[rowKeyField]}
      scroll={{ x: breakpoints?.scrollX, y: breakpoints?.scrollY }}
      onRow={
        onRowClick
          ? (data) => ({
              onClick: () => onRowClick(data as T),
            })
          : null
      }
    />
  );
};

export default TableView;
