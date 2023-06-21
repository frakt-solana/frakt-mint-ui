import { NFT } from '@frakt/api/nft'
import {
  createHeaderCell,
  createSolValueJSX,
  createValueJSX,
} from '@frakt/components/TableComponents'
import { ColumnsType, ColumnType } from 'antd/es/table'
import { SortOrder } from 'antd/lib/table/interface'

export type SortColumns = {
  column: ColumnType<NFT>
  order: SortOrder
}[]

export const getTableList = () => {
  const COLUMNS: ColumnsType<NFT> = [
    {
      key: 'name',
      dataIndex: 'name',
      title: (column) =>
        createHeaderCell(column, 'Name', 'name', null, true, true),
      // render: (_, nft) => <CollectionInfoCell nft={nft} />,
    },
    {
      key: 'borrow',
      dataIndex: 'borrow',
      title: (column) => createHeaderCell(column, 'Borrow', 'borrow'),
      render: (_, nft) => createSolValueJSX(nft?.maxLoanValue),
    },
    {
      key: 'fee',
      dataIndex: 'fee',
      title: (column) => createHeaderCell(column, 'Fee', 'fee'),
      render: (_, nft) =>
        createValueJSX(parseFloat(nft?.bondParams?.fee?.toFixed(2))),
    },
    {
      key: 'repay',
      dataIndex: 'repay',
      title: (column) => createHeaderCell(column, 'Repay', 'repay'),
      render: (_, nft) =>
        createValueJSX(parseFloat(nft?.bondParams?.fee?.toFixed(2))),
    },
    // {
    //   render: (_, bond: any) => (
    //     // <ExitCell bonds={data} hideBond={hideBond} bond={bond} />
    //   ),
    // },
  ]

  return COLUMNS
}
