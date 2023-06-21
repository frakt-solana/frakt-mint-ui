import moment from 'moment'

import styles from './TableComponents.module.scss'

export const createSolValueJSX = (value = 0, formatValue = true) => {
  const formattedValue = formatValue ? (value / 1e9 || 0).toFixed(2) : value

  return (
    <span className={styles.value}>
      {value ? <>{formattedValue} ◎</> : '--'}
    </span>
  )
}

export const createPercentValueJSX = (value: number) => (
  <span className={styles.value}>{value ? `${value.toFixed(0)} %` : '--'}</span>
)

export const createValueJSX = (value: string | number) => (
  <span className={styles.value}>{value || '--'}</span>
)

export const createValueTimeJSX = (value: number) => (
  <span className={styles.value}>
    {value ? moment.unix(value).fromNow(false) : '--'}
  </span>
)
