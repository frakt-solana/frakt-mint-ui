import { FC } from 'react'

import { BANX } from '@frakt/icons'
import { TOTAL_NFTS_MINT } from '@frakt/constants'

import styles from './ProgressBar.module.scss'

interface ProgressBarProps {
  value: number
  maxValue?: number
}

const ProgressBar: FC<ProgressBarProps> = ({
  value,
  maxValue = TOTAL_NFTS_MINT,
}) => {
  const percentage = (value / maxValue) * 100

  const getProgressBarStyle = () => {
    return { width: `${percentage}%` }
  }
  return (
    <div className={styles.container}>
      <div className={styles.progress} style={getProgressBarStyle()}>
        <img className={styles.sliderPoint} src={BANX} />
      </div>
    </div>
  )
}

export default ProgressBar
