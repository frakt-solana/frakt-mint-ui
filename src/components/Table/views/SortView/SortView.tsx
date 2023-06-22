import classNames from 'classnames'
import { DebouncedFunc } from 'lodash'

import { CardView, TableView } from '@frakt/icons'
import Button from '@frakt/components/Button'

import { Search } from '../../components/Search'
import { useTableView } from '../../hooks'

import styles from './SortView.module.scss'

interface SortViewProps<T> {
  search?: {
    placeHolderText?: string
    onChange: DebouncedFunc<
      (event: React.ChangeEvent<HTMLInputElement>) => void
    >
  }
  showSearching?: boolean
}

const SortView = <T extends unknown>({
  search,
  showSearching = false,
}: SortViewProps<T>) => {
  const renderSearchInput = () => {
    if (!showSearching) return null

    return (
      <div className={styles.searchWrapper}>
        <Search
          onChange={search?.onChange}
          className={styles.searchInput}
          placeHolderText={search?.placeHolderText}
        />
      </div>
    )
  }

  return <div className={styles.sortWrapper}>{renderSearchInput()}</div>
}

export default SortView
