import classNames from 'classnames'
import { ColumnsType } from 'antd/es/table'
import { DebouncedFunc } from 'lodash'

import { CardView, TableView } from '@frakt/icons'
import Checkbox from '@frakt/components/Checkbox'
import Button from '@frakt/components/Button'

import { SelectLoansParams, Sort } from '../../types'
import { Search } from '../../components/Search'
import { useTableView } from '../../hooks'

import styles from './SortView.module.scss'

interface SortViewProps<T> {
  columns: ColumnsType<T>
  setSort: (nextSort: Sort) => void
  sort: Sort
  search?: {
    placeHolderText?: string
    onChange: DebouncedFunc<
      (event: React.ChangeEvent<HTMLInputElement>) => void
    >
  }
  selectLoansParams?: SelectLoansParams
  setQueryData: (nextSort: Sort) => void
  showSorting?: boolean
  showSearching?: boolean
  showToggle?: boolean
  isToggleChecked: boolean
  setIsToggleChecked: (value: boolean) => void
}

const SortView = <T extends unknown>({
  search,
  selectLoansParams: selectParams,
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
        {selectParams?.onChange && (
          <Checkbox
            className={styles.checkbox}
            classNameInnerContent={styles.checkboxInnerContent}
            onChange={selectParams.onChange}
            checked={selectParams.selected}
          />
        )}
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
