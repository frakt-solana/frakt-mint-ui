import { NFT } from '@frakt/api/nft'
import {
  createHeaderCell,
  createSolValueJSX,
  createValueJSX,
} from '@frakt/components/TableComponents'
import { ColumnsType, ColumnType } from 'antd/es/table'
import { SortOrder } from 'antd/lib/table/interface'
import styles from './BondsTable.module.scss'
import MintAndBorrowButton from './MintAndBorrowButton'

export type SortColumns = {
  column: ColumnType<NFT>
  order: SortOrder
}[]

export const getTableList = (onCancelModal: () => void) => {
  const COLUMNS: ColumnsType<NFT> = [
    {
      key: 'name',
      dataIndex: 'name',
      title: () => createHeaderCell('Name', true),
      render: (_, nft) => (
        <div className={styles.collectionInfo}>
          <img src={nft?.imageUrl} className={styles.collectionImage} />
          <p className={styles.collectionName}>{nft?.name}</p>
        </div>
      ),
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
    {
      render: (_, nft) => (
        <MintAndBorrowButton onCancelModal={onCancelModal} nft={nft} />
      ),
    },
  ]

  return COLUMNS
}
