import { useEffect, useState } from 'react'
import { Howl } from 'howler'

import tableReveal from '@frakt/sounds/tableRevealSound.mp3'
import pfpRevealSound from '@frakt/sounds/pfpRevealSound.mp3'
import cardMove from '@frakt/sounds/cardMoveSound.mp3'
import flashSound from '@frakt/sounds/flashSound.mp3'

export const useOpenAnimation = ({
  isStartAnimation,
  selectedNftImage,
  mintedNftImage,
}: {
  isStartAnimation: boolean
  selectedNftImage: string
  mintedNftImage: string
}) => {
  const [scale, setScale] = useState(1)
  const [isAnimationEnd, setIsAnimationEnd] = useState(false)
  const [nftImage, setNftImage] = useState(selectedNftImage)

  const [flash, pfpReveal] = [
    new Howl({ src: [flashSound] }),
    new Howl({ src: [pfpRevealSound] }),
  ]

  useEffect(() => {
    if (isStartAnimation) {
      const animationTimeout1 = setTimeout(() => {
        setScale(2.2)
        flash.play()
      }, 500)

      const animationTimeout2 = setTimeout(() => {
        setScale(1)
        setNftImage(mintedNftImage)
      }, 1500)

      const animationTimeout3 = setTimeout(() => {
        setIsAnimationEnd(true)
        pfpReveal.play()
      }, 2500)

      return () => {
        flash.stop()
        pfpReveal.stop()
        clearTimeout(animationTimeout1)
        clearTimeout(animationTimeout2)
        clearTimeout(animationTimeout3)
      }
    }
  }, [isStartAnimation])

  return {
    scale,
    isAnimationEnd,
    nftImage,
  }
}

export const useCardAnimation = (isAnimationEnd: boolean) => {
  const [isStartCardAnimation, setIsStartCardAnimation] =
    useState<boolean>(false)
  const [animationCompleted, setAnimationCompleted] = useState<boolean>(false)

  const [isCardAnimationEnded, setIsCardAnimationEnded] =
    useState<boolean>(false)

  const [cardMoveSound, tableRevealSound] = [
    new Howl({ src: [cardMove] }),
    new Howl({ src: [tableReveal] }),
  ]

  useEffect(() => {
    if (isAnimationEnd) {
      const timer = setTimeout(() => {
        cardMoveSound.play()
        setIsStartCardAnimation(true)
      }, 1000)
      return () => {
        cardMoveSound.stop()
        clearTimeout(timer)
      }
    }
  }, [isAnimationEnd])

  const handleAnimationEnd = () => {
    setAnimationCompleted(true)
  }

  useEffect(() => {
    if (isStartCardAnimation) {
      const animationTimer = setTimeout(() => {
        setAnimationCompleted(true)
      }, 500)

      const nameTimer = setTimeout(() => {
        tableRevealSound.play()

        setIsCardAnimationEnded(true)
      }, 1000)

      return () => {
        tableRevealSound.stop()
        clearTimeout(animationTimer)
        clearTimeout(nameTimer)
      }
    }
  }, [isStartCardAnimation])

  return {
    isStartCardAnimation,
    animationCompleted,
    isCardAnimationEnded,
    handleAnimationEnd,
  }
}
