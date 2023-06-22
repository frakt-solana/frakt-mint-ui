import { FC } from 'react'

import { Modal } from '@frakt/components/Modal'
import styles from './LoanModal.module.scss'
import { Button } from '../Button'

interface LoanModalProps {
  open: boolean
  onCancel?: () => void
  onSumbit?: any
}

const LoanModal: FC<LoanModalProps> = ({ open, onSumbit, onCancel }) => {
  return (
    <Modal
      open={open}
      centered
      onCancel={onCancel}
      width={512}
      footer={false}
      closable={false}
      className={styles.modal}
      closeIcon
    >
      <div className={styles.content}>
        <h4>A bit of important info</h4>
        <p>
          You may check your loan on{' '}
          <a
            href="https://app.frakt.xyz/loans"
            target="_blank"
            rel="noopener noreferrer"
          >
            frakt.xyz/loans
          </a>
          <br />
          Please make sure that you repay your loan on time
        </p>

        <Button onClick={onSumbit} className={styles.button} type="secondary">
          Continue borrowing
        </Button>
      </div>
    </Modal>
  )
}

export default LoanModal
