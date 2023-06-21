import { FC } from 'react'

import Table, { useTable, PartialBreakpoints } from '@frakt/components/Table'

import { getTableList } from './columns'

export interface BondsTableProps {
  data: ReadonlyArray<any>
  loading?: boolean
  className?: string
  breakpoints?: PartialBreakpoints
}

export const BondsTable: FC<BondsTableProps> = ({
  data,
  loading,
  className,
  breakpoints,
}) => {
  const COLUMNS = getTableList()

  const { table, search } = useTable({
    data,
    columns: COLUMNS,
    loading,
  })

  return (
    <Table
      {...table}
      search={search}
      className={className}
      breakpoints={breakpoints}
    />
  )
}
