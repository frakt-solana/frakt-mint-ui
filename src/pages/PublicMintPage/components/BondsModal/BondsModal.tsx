import { FC } from 'react'
import { Modal } from '@frakt/components/Modal'

import { useFetchWalletNFTs } from './hooks'
import { BondsTable } from '../BondsTable'

import styles from './BondsModal.module.scss'
import { Loader } from '@frakt/components/Loader'

interface BondsModalProps {
  open: boolean
  onCancel?: () => void
}

const BondsModal: FC<BondsModalProps> = ({ open, onCancel }) => {
  const { nfts, loading } = useFetchWalletNFTs()

  return (
    <Modal
      open={open}
      centered
      onCancel={onCancel}
      width={768}
      footer={false}
      closable={false}
      className={styles.modal}
      closeIcon
    >
      <div className={styles.content}>
        <div className={styles.stats}>
          <div className={styles.statsValue}>
            <p>{nfts?.length || 0}</p>
            <span>NFTs available</span>
          </div>
        </div>
        {!nfts?.length && !loading && <EmptyList />}
        {!!nfts?.length && !loading && (
          <BondsTable
            onCancelModal={onCancel}
            breakpoints={{ scrollX: 600 }}
            className={styles.bondsTable}
            data={nfts}
          />
        )}
        {!nfts?.length && loading && <Loader />}
      </div>
    </Modal>
  )
}

export default BondsModal

const EmptyList = () => (
  <div className={styles.emptyContainer}>
    <h4>You don't have suitable NFTs</h4>
  </div>
)
