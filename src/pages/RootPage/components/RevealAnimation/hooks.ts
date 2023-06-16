import { useEffect, useState } from 'react'

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

  useEffect(() => {
    if (isStartAnimation) {
      const animationTimeout1 = setTimeout(() => {
        setScale(2.2)
      }, 500)

      const animationTimeout2 = setTimeout(() => {
        setScale(1)
        setNftImage(mintedNftImage)
      }, 1500)

      const animationTimeout3 = setTimeout(() => {
        setIsAnimationEnd(true)
      }, 2500)

      return () => {
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

  useEffect(() => {
    if (isAnimationEnd) {
      const timer = setTimeout(() => {
        setIsStartCardAnimation(true)
      }, 1000)
      return () => clearTimeout(timer)
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
        setIsCardAnimationEnded(true)
      }, 1000)

      return () => {
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
