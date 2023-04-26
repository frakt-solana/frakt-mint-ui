import { useCountdown } from '@frakt/hooks/useCountdown'
import styles from './styles.module.scss'

export const createTimerJSX = (endTime: number): JSX.Element | string => {
  const timeLeft = useCountdown(endTime)
  const dayNumber = !!parseFloat(timeLeft.days)

  return (
    <div className={styles.timer}>
      {dayNumber && <span>{timeLeft.days} d : </span>}
      <span>{timeLeft.hours} h </span>: <span>{timeLeft.minutes} m </span>
      {!dayNumber && <span>: {timeLeft.seconds} s</span>}
    </div>
  )
}
