import classNames from 'classnames'

import styles from './TableComponents.module.scss'

interface HeaderCellProps<T> {
  label: string
  fixedLeft?: boolean
}

export const HeaderCell = <T extends unknown>({
  label,
  fixedLeft,
}: HeaderCellProps<T>) => {
  return (
    <div
      className={classNames(styles.row, styles.rowFixedRight, {
        [styles.fixedLeftRow]: fixedLeft,
      })}
    >
      <span className={styles.headerCellTitle}>{label}</span>
    </div>
  )
}
