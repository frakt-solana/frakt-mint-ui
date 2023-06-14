import classNames from 'classnames'

import { useCardAnimation, useOpenAnimation } from './hooks'
import Card from '../Card/Card'
import Svg1 from './svg1.svg'

import styles from './OpenAnimaion.module.scss'

interface OpenAnimaionProps {
  isStartAnimation: boolean
  selectedNftImage: string
  receivedNftImage: string
}

const OpenAnimaion = ({
  isStartAnimation,
  selectedNftImage,
  receivedNftImage,
}: OpenAnimaionProps) => {
  const { scale, isAnimationEnd, nftImage } = useOpenAnimation({
    isStartAnimation,
    selectedNftImage,
    receivedNftImage,
  })

  const {
    isStartCardAnimation,
    animationCompleted,
    isCardAnimationEnded,
    handleAnimationEnd,
  } = useCardAnimation(isAnimationEnd)

  return (
    <div className={styles.container}>
      <Card
        image={nftImage}
        onAnimationEnd={handleAnimationEnd}
        isAnimationStarted={isStartCardAnimation}
        isStartFlip={isStartAnimation}
      />
      <ExplosionSvg scale={scale} isAnimationEnd={isAnimationEnd} />
      {animationCompleted && (
        <>
          <NftName
            isVisible={isCardAnimationEnded}
            name="You minted Banx #2345!"
          />
          <RaritiButton isVisible={isCardAnimationEnded} rarity="Legendary" />
          <Attributes isVisible={isCardAnimationEnded} />
        </>
      )}
    </div>
  )
}

export default OpenAnimaion

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

const NftName = ({ isVisible, name }) => (
  <div className={classNames(styles.name, { [styles.active]: isVisible })}>
    {name}
  </div>
)

const RaritiButton = ({ isVisible, rarity }) => (
  <div
    className={classNames(styles.rarityButton, { [styles.active]: isVisible })}
  >
    <p className={styles.rarity}>{rarity}</p>
  </div>
)

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
