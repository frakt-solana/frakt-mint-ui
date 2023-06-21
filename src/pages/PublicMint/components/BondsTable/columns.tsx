import { createHeaderCell } from '@frakt/components/TableComponents'
import { ColumnsType, ColumnType } from 'antd/es/table'
import { SortOrder } from 'antd/lib/table/interface'

export type SortColumns = {
  column: ColumnType<any>
  order: SortOrder
}[]

export const getTableList = () => {
  const COLUMNS: ColumnsType<any> = [
    {
      key: 'name',
      dataIndex: 'name',
      title: (column) =>
        createHeaderCell(column, 'Name', 'name', null, true, true),
      //   render: (_, liquidityPool) => (
      //     <CollectionInfoCell liquidityPool={liquidityPool} />
      //   ),
    },
    {
      key: 'borrow',
      dataIndex: 'borrow',
      title: (column) => createHeaderCell(column, 'Borrow', 'borrow'),
      //   render: (_, { stats }) => (
      //     <SizeCell ltv={stats?.ltv} size={stats?.size} />
      //   ),
    },
    {
      key: 'fee',
      dataIndex: 'fee',
      title: (column) => createHeaderCell(column, 'Fee', 'fee'),
    },
    {
      key: 'repay',
      dataIndex: 'repay',
      title: (column) => createHeaderCell(column, 'Repay', 'repay'),
    },
    // {
    //   render: (_, bond: any) => (
    //     // <ExitCell bonds={data} hideBond={hideBond} bond={bond} />
    //   ),
    // },
  ]

  return COLUMNS
}
