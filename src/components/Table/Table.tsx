import { ChangeEvent } from 'react'
import { ColumnsType } from 'antd/es/table'
import { DebouncedFunc } from 'lodash'

import {
  ActiveRowParams,
  ViewParams,
  PartialBreakpoints,
  SelectLoansParams,
} from './types'
import { Loader } from '../Loader'

import { TableView, CardView, SortView } from './views'
import { Search } from './components/Search'

export interface TableProps<T> {
  data: ReadonlyArray<T>
  columns: ColumnsType<T>

  loading?: boolean
  rowKeyField?: string
  onRowClick?: (dataItem: T) => void
  defaultField?: string
  filterField?: string | string[]
  search?: {
    placeHolderText?: string
    onChange: DebouncedFunc<(event: ChangeEvent<HTMLInputElement>) => void>
  }

  selectLoansParams?: SelectLoansParams
  breakpoints?: PartialBreakpoints
  activeRowParams?: ActiveRowParams
  viewParams?: ViewParams

  className?: string
  cardClassName?: string
}

const Table = <T extends unknown>({
  data,
  columns,
  onRowClick,
  rowKeyField = 'id',
  loading = false,
  className,
  breakpoints,
  activeRowParams,
  search,
  viewParams,
  cardClassName,
}: any): JSX.Element => {
  if (loading) return <Loader />

  const showSorting = viewParams?.showSorting
  const showSearching = viewParams?.showSearching
  const showCard = viewParams?.showCard

  const SortViewComponent = showSorting || showSearching ? SortView : null
  const ViewComponent = showCard ? CardView : TableView

  return (
    <>
      {SortViewComponent && (
        <SortViewComponent search={search} showSearching={showSearching} />
      )}
      {ViewComponent && (
        <ViewComponent
          data={data}
          columns={columns}
          onRowClick={onRowClick}
          rowKeyField={rowKeyField}
          className={showCard ? cardClassName : className}
          activeRowParams={activeRowParams}
          breakpoints={breakpoints}
          loading={loading}
        />
      )}
    </>
  )
}

Table.Search = Search

export { Table }
