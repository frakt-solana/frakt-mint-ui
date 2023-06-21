import { FC } from 'react'
import { Modal } from '@frakt/components/Modal'

import styles from './BondsModal.module.scss'
import { BondsTable } from '../BondsTable'

interface BondsModalProps {
  open: boolean
  onCancel?: () => void
}

const BondsModal: FC<BondsModalProps> = ({ open, onCancel }) => {
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
            <p>20</p>
            <span>NFTs</span>
          </div>
          <div className={styles.statsValue}>
            <p>12</p>
            <span>BANX available</span>
          </div>
        </div>
        <BondsTable data={[]} />
      </div>
    </Modal>
  )
}

export default BondsModal
