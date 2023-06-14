import { FC } from 'react'
import classNames from 'classnames'

import styles from './Card.module.scss'

interface CardProps {
  image: string
  onAnimationEnd?: () => void
  isAnimationStarted?: boolean
}

const Card: FC<CardProps> = ({ image, onAnimationEnd, isAnimationStarted }) => {
  return (
    <div
      style={{
        backgroundImage: `url(${image})`,
      }}
      className={classNames(styles.card, {
        [styles.animate]: isAnimationStarted,
      })}
      onAnimationEnd={onAnimationEnd}
    />
  )
}

export default Card
