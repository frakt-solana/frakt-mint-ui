import { FC } from 'react'

import styles from './PendingMintView.module.scss'

const PendingMintView: FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.timerWrapper}>
        <h4 className={styles.timer}>5d : 14h : 13m</h4>
        <p className={styles.timerText}>Until mint</p>
      </div>
      <div className={styles.content}>
        <p className={styles.contentText}>
          You have X5 WL tokens to mint for 10 SOL and 15 frakts and gnomies to
          mint for 0 SOL
        </p>
      </div>
    </div>
  )
}

export default PendingMintView
