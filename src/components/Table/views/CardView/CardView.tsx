import { ColumnsType } from 'antd/es/table';
import classNames from 'classnames';

import { ActiveRowParams } from '../../types';
import styles from './CardView.module.scss';
import { getCardOrRowClassName } from '../../helpers';

interface CardViewProps<T> {
  columns: ColumnsType<T> | any;
  data: ReadonlyArray<T>;
  onRowClick?: (dataItem: T) => void;
  rowKeyField: string;
  className?: string;
  activeRowParams: ActiveRowParams;
}

const CardView = <T extends unknown>({
  data,
  columns,
  onRowClick,
  rowKeyField,
  className,
  activeRowParams,
}: CardViewProps<T>): JSX.Element => {
  return (
    <div className={classNames({ [styles.cardList]: data?.length }, className)}>
      {data?.map((dataRow) => (
        <div
          className={classNames(
            styles.card,
            getCardOrRowClassName(dataRow, activeRowParams, true),
          )}
          onClick={onRowClick ? () => onRowClick(dataRow) : null}
          key={dataRow[rowKeyField]}
        >
          {columns?.map(({ key, title, render }, idx: number) => (
            <div className={styles.cardRow} key={key}>
              <div className={styles.cardRowTitle}>{title && title()}</div>
              {render && render(dataRow[key], dataRow, idx)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default CardView;
