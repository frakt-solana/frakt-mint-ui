import { FC } from 'react'

import { createTimerJSX } from '@frakt/components/Timer'
import Heading from '../../components/Heading'

import styles from './PendingMint.module.scss'
import { BANX } from '@frakt/icons'

const PendingMintView: FC = () => {
  return (
    <div className={styles.container}>
      <Heading />
      <div className={styles.timerWrapper}>
        {createTimerJSX(1683752399)}
        <p className={styles.timerText}>Until mint</p>
      </div>
      <div className={styles.content}>
        <p className={styles.contentText}>
          You have X5 <img src={BANX} /> WL tokens to mint for 10 SOL and 15
          frakts and gnomies to mint for 0 SOL
        </p>
      </div>
    </div>
  )
}

export default PendingMintView
