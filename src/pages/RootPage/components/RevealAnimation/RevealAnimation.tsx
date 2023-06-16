import { useEffect, useState } from 'react'
import classNames from 'classnames'

import { MintedNft } from '../../views/LiveMint/components/MintForNFTs/helpers'
import { useCardAnimation, useOpenAnimation } from './hooks'
import LoaderAnimation from '../LoaderAnimation'
import starIcon from './star.svg'
import Card from '../Card/Card'
import Svg1 from './svg1.svg'

import styles from './RevealAnimation.module.scss'
import { Button } from '@frakt/components/Button'

interface RevealAnimationProps {
  isStartAnimation: boolean
  selectedNftImage: string
  mintedNft: MintedNft
  isLoading: boolean
  handleResetAnimation: () => void
}

const RevealAnimation = ({
  isStartAnimation,
  selectedNftImage,
  mintedNft,
  isLoading,
  handleResetAnimation,
}: RevealAnimationProps) => {
  const { scale, isAnimationEnd, nftImage } = useOpenAnimation({
    isStartAnimation: !isLoading && isStartAnimation,
    selectedNftImage,
    mintedNftImage: mintedNft?.imageUrl,
  })

  const {
    isStartCardAnimation,
    animationCompleted,
    isCardAnimationEnded,
    handleAnimationEnd,
  } = useCardAnimation(isAnimationEnd)

  return (
    <div className={styles.container}>
      <div>
        {isLoading && <LoaderAnimation />}
        <Card
          image={nftImage}
          onAnimationEnd={handleAnimationEnd}
          isAnimationStarted={isStartCardAnimation}
          isStartFlip={!isLoading && isStartAnimation}
        />
      </div>

      {!isLoading && (
        <ExplosionSvg scale={scale} isAnimationEnd={isAnimationEnd} />
      )}
      {animationCompleted && (
        <>
          <NftName
            isVisible={isCardAnimationEnded}
            name={`You minted ${mintedNft?.name}!`}
          />
          <div className={styles.rarityButtonWrapper}>
            <RaritiButton isVisible={isCardAnimationEnded} rarity="Legendary" />
          </div>
          <Attributes isVisible={isCardAnimationEnded} />
          <SelectNextNftButton
            isVisible={isCardAnimationEnded}
            onClick={handleResetAnimation}
          />
        </>
      )}
    </div>
  )
}

export default RevealAnimation

const ExplosionSvg = ({ scale, isAnimationEnd }) => (
  <img
    src={Svg1 as any}
    style={{
      opacity: isAnimationEnd ? '0' : '1',
      transform: `scale(${scale})`,
    }}
    className={classNames(styles.svgImage, { [styles.active]: scale })}
  />
)

const SelectNextNftButton = ({ isVisible, onClick }) => {
  const [visibleButton, setVisibleButton] = useState(false)

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setVisibleButton(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isVisible])

  return (
    <Button
      type="secondary"
      className={classNames(styles.selectNextNftButton, {
        [styles.active]: visibleButton,
      })}
      onClick={onClick}
    >
      Select next one
    </Button>
  )
}

const NftName = ({ isVisible, name }) => (
  <div className={classNames(styles.name, { [styles.active]: isVisible })}>
    {name}
  </div>
)

const RaritiButton = ({ isVisible, rarity }) => {
  const [animationStep, setAnimationStep] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimationStep((prevStep) => (prevStep + 1) % 3)
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  const starIcons = [1, 2, 3, 4]

  return (
    <div
      className={classNames(styles.rarityButton, {
        [styles.active]: isVisible,
      })}
    >
      {starIcons.map((index) => (
        <img
          key={index}
          src={starIcon as any}
          className={classNames(styles[`starIcon${index}`], {
            [styles.visible]: isVisible,
            [styles.hidden1]: animationStep === 0,
            [styles.hidden2]: animationStep === 1,
            [styles.hidden3]: animationStep === 2,
          })}
        />
      ))}
      <p className={styles.rarity}>{rarity}</p>
    </div>
  )
}

const Attributes = ({ isVisible }) => {
  const attributes = [
    { label: 'Body', value: 'Polo shirt', className: styles.values1 },
    { label: 'Fur', value: 'Blue', className: styles.values2 },
    { label: 'Eyes', value: 'Solana Glasses', className: styles.values3 },
    { label: 'Background', value: 'Purple', className: styles.values4 },
  ]

  return (
    <div
      className={classNames(styles.attributes, { [styles.active]: isVisible })}
    >
      {attributes.map((attribute, index) => (
        <div key={index} className={attribute.className}>
          <p className={styles.label}>{attribute.label}</p>
          <p className={styles.value}>{attribute.value}</p>
        </div>
      ))}
    </div>
  )
}
