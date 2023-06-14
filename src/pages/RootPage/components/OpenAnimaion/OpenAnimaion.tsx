import { useEffect, useState } from 'react'
import classNames from 'classnames'

import Svg1 from './svg1.svg'

import styles from './OpenAnimaion.module.scss'
import Card from '../Card/Card'

const OpenAnimaion = () => {
  const [scale, setScale] = useState(1.2)
  const [isAnimationEnd, setIsAnimationEnd] = useState(false)

  useEffect(() => {
    const animationTimeout1 = setTimeout(() => {
      setScale(1.8)
    }, 1000)

    const animationTimeout2 = setTimeout(() => {
      setScale(1)
    }, 3000)

    const animationTimeout3 = setTimeout(() => {
      setIsAnimationEnd(true)
    }, 5000)

    return () => {
      clearTimeout(animationTimeout1)
      clearTimeout(animationTimeout2)
      clearTimeout(animationTimeout3)
    }
  }, [])

  return (
    <div className={styles.container}>
      <img
        style={{
          opacity: isAnimationEnd ? '0' : '1',
          transform: `scale(${scale})`,
          transition: 'transform 2s ease-in-out, opacity 2s ease-in-out',
        }}
        className={classNames(styles.svgImage, {
          [styles.active]: scale,
        })}
        src={Svg1 as any}
      />

      <Card image={'https://pbs.twimg.com/media/FuaAl7sXoAIm_jk.png'} />

      {isAnimationEnd && <CardAnimation />}
    </div>
  )
}

export default OpenAnimaion

export const CardAnimation: React.FC = () => {
  const { isVisible, animationCompleted, showName, handleAnimationEnd } =
    useCardAnimation()

  return (
    <div className={styles.container}>
      <Card
        image={'https://pbs.twimg.com/media/FuaAl7sXoAIm_jk.png'}
        onAnimationEnd={handleAnimationEnd}
        isAnimationStarted={isVisible}
      />

      {animationCompleted && (
        <div className={classNames(styles.name, { [styles.active]: showName })}>
          You minted Banx #2345!
        </div>
      )}
      {animationCompleted && (
        <RaritiButton className={showName && styles.rarityButtonActive} />
      )}
      {animationCompleted && (
        <Attributes className={showName && styles.attributesActive} />
      )}
    </div>
  )
}

export const useCardAnimation = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [animationCompleted, setAnimationCompleted] = useState<boolean>(false)
  const [showName, setShowName] = useState<boolean>(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleAnimationEnd = () => {
    setAnimationCompleted(true)
  }

  useEffect(() => {
    if (isVisible) {
      const animationTimer = setTimeout(() => {
        setAnimationCompleted(true)
      }, 500)

      const nameTimer = setTimeout(() => {
        setShowName(true)
      }, 1000)

      return () => {
        clearTimeout(animationTimer)
        clearTimeout(nameTimer)
      }
    }
  }, [isVisible])

  return {
    isVisible,
    animationCompleted,
    showName,
    handleAnimationEnd,
  }
}

const RaritiButton = ({ className }) => (
  <div className={classNames(styles.rarityButton, className)}>
    <p className={styles.rarity}>Legendary</p>
  </div>
)

const Attributes = ({ className }) => (
  <div className={classNames(styles.attribures, className)}>
    <div className={styles.attriburesWrapper}>
      <div className={styles.values}>
        <p className={styles.label}>Body</p>
        <p className={styles.value}>Polo shirt</p>
      </div>
      <div className={styles.values}>
        <p className={styles.label}>Fur</p>
        <p className={styles.value}>Blue</p>
      </div>
    </div>
    <div className={styles.attriburesWrapper}>
      <div className={styles.values}>
        <p className={styles.label}>Eyes</p>
        <p className={styles.value}>Solana Glasses</p>
      </div>
      <div className={styles.values}>
        <p className={styles.label}>Background</p>
        <p className={styles.value}>Purple</p>
      </div>
    </div>
  </div>
)
