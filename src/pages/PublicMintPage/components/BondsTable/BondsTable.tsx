import { FC } from 'react'

import Table, { useTable, PartialBreakpoints } from '@frakt/components/Table'

import { getTableList } from './columns'
import { NFT } from '@frakt/api/nft'

export interface BondsTableProps {
  data: ReadonlyArray<NFT>
  loading?: boolean
  className?: string
  breakpoints?: PartialBreakpoints
  onCancelModal: () => void
}

export const BondsTable: FC<BondsTableProps> = ({
  data,
  loading,
  className,
  breakpoints,
  onCancelModal,
}) => {
  const COLUMNS = getTableList(onCancelModal)

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
      viewParams={{
        showSorting: false,
        showSearching: true,
        showToggle: false,
      }}
    />
  )
}
