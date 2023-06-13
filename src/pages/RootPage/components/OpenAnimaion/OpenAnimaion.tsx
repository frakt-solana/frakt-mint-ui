import { useEffect, useState } from 'react'
import classNames from 'classnames'

import Svg1 from './svg1.svg'
import Svg2 from './svg2.svg'
import Svg3 from './svg3.svg'

import styles from './OpenAnimaion.module.scss'

const OpenAnimaion = () => {
  const [scale, setScale] = useState(1)
  const [svgIndex, setSvgIndex] = useState(0)

  useEffect(() => {
    const svgInterval = setInterval(() => {
      setSvgIndex((prevIndex) => (prevIndex + 1) % 3)
    }, 3000)

    return () => clearInterval(svgInterval)
  }, [])

  useEffect(() => {
    const animationTimeout1 = setTimeout(() => {
      setScale(1.6)
    }, 2000)

    const animationTimeout2 = setTimeout(() => {
      setScale(1)
    }, 4000)

    return () => {
      clearTimeout(animationTimeout1)
      clearTimeout(animationTimeout2)
    }
  }, [])

  const svgFiles = [Svg1, Svg2, Svg3]
  const currentSvg = svgFiles[svgIndex]

  return (
    <>
      <div className={styles.svgContainer}>
        <img
          style={{
            transform: `scale(${scale})`,
            transition: 'transform 2s ease-in-out, opacity 2s ease-in-out',
          }}
          className={classNames(styles.svgImage, {
            [styles.active]: scale,
          })}
          src={currentSvg as any}
          alt={`SVG ${svgIndex + 1}`}
        />
      </div>
    </>
  )
}

export default OpenAnimaion

export const CardAnimation: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [animationCompleted, setAnimationCompleted] = useState<boolean>(false)

  const [showName, setShowName] = useState(false)

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

  return (
    <div className={styles.container}>
      <div
        style={{
          backgroundImage: `url('https://pbs.twimg.com/media/FuaAl7sXoAIm_jk.png')`,
        }}
        className={classNames(styles.card, { [styles.visible]: isVisible })}
        onAnimationEnd={handleAnimationEnd}
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
