import { FC, useEffect, useState } from 'react'
import classNames from 'classnames'

import styles from './Card.module.scss'

interface CardProps {
  image: string
  onAnimationEnd?: () => void
  isAnimationStarted?: boolean
  isStartFlip?: boolean
}

const Card: FC<CardProps> = ({
  image,
  onAnimationEnd,
  isAnimationStarted,
  isStartFlip,
}) => {
  const [flipped, setFlipped] = useState(false)

  useEffect(() => {
    if (isStartFlip) {
      const animationTimeout1 = setTimeout(() => {
        setFlipped(true)
      }, 500)

      const animationTimeout2 = setTimeout(() => {
        setFlipped(false)
      }, 1300)

      return () => {
        clearTimeout(animationTimeout1)
        clearTimeout(animationTimeout2)
      }
    }
  }, [isStartFlip])

  return (
    <div className={styles.flipCard}>
      <div
        className={classNames(styles.flipCardInner, {
          [styles.flipped]: flipped,
        })}
      >
        <div className={styles.flipCardFront}>
          <div
            style={{
              backgroundImage: `url(${image})`,
            }}
            className={classNames(styles.card, {
              [styles.animate]: isAnimationStarted,
            })}
            onAnimationEnd={onAnimationEnd}
          />
        </div>
        <div className={styles.flipCardBack} />
      </div>
    </div>
  )
}

export default Card
