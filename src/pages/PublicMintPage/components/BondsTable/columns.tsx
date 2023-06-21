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
      title: () => createHeaderCell('Name', true),
      // render: (_, nft) => <CollectionInfoCell nft={nft} />,
    },
    {
      key: 'borrow',
      dataIndex: 'borrow',
      title: () => createHeaderCell('Borrow'),
      render: (_, nft) => createSolValueJSX(nft?.maxLoanValue),
    },
    {
      key: 'fee',
      dataIndex: 'fee',
      title: () => createHeaderCell('Fee'),
      render: (_, nft) =>
        createValueJSX(parseFloat(nft?.bondParams?.fee?.toFixed(2))),
    },
    {
      key: 'repay',
      dataIndex: 'repay',
      title: () => createHeaderCell('Repay'),
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
