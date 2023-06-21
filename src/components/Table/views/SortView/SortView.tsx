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
  const { viewState, setViewState } = useTableView()

  const handleViewStateChange = (state: 'card' | 'table') => {
    setViewState(state)
  }

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

  const renderSwitchButtons = () => {
    return (
      <div className={styles.switchButtons}>
        <Button
          className={classNames(styles.switchViewButton, {
            [styles.active]: viewState === 'card',
          })}
          onClick={() => handleViewStateChange('card')}
          type="tertiary"
        >
          <CardView />
        </Button>
        <Button
          className={classNames(styles.switchViewButton, {
            [styles.active]: viewState === 'table',
          })}
          onClick={() => handleViewStateChange('table')}
          type="tertiary"
        >
          <TableView />
        </Button>
      </div>
    )
  }

  return (
    <div className={styles.sortWrapper}>
      {renderSearchInput()}
      <div className={styles.rowGap}>{renderSwitchButtons()}</div>
    </div>
  )
}

export default SortView
