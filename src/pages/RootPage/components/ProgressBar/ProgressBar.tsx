import { FC } from 'react'
import { SliderPoint as sliderPoint } from '@frakt/icons'

import styles from './ProgressBar.module.scss'

interface ProgressBarProps {
  value: number
  maxValue: number
}

const ProgressBar: FC<ProgressBarProps> = ({ value, maxValue }) => {
  const percentage = (value / maxValue) * 100

  const getProgressBarStyle = () => {
    return { width: `${percentage}%` }
  }
  return (
    <div className={styles.container}>
      <div className={styles.progress} style={getProgressBarStyle()}>
        <img className={styles.sliderPoint} src={sliderPoint} />
      </div>
    </div>
  )
}

export default ProgressBar
