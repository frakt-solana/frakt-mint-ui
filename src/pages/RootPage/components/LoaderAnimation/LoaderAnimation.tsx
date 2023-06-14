import { useEffect, useState } from 'react'
import classNames from 'classnames'

import styles from './LoaderAnimation.module.scss'

import Svg1 from './svg1.svg'
import Svg2 from './svg2.svg'
import Svg3 from './svg3.svg'
import Svg4 from './svg4.svg'

const LoaderAnimation = () => {
  const [currentSVGIndex, setCurrentSVGIndex] = useState(0)

  useEffect(() => {
    const startAnimation = () => {
      setCurrentSVGIndex((prevIndex) => (prevIndex + 1) % 4)
    }

    startAnimation()

    const interval = setInterval(startAnimation, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  const svgFiles = [Svg1, Svg2, Svg3, Svg4]

  return (
    <div className={styles.svgContainer}>
      {svgFiles.map((svg, index) => (
        <img
          key={index}
          className={classNames(styles.svgImage, {
            [styles.active]: currentSVGIndex === index,
          })}
          src={svg as any}
          alt={`SVG ${index + 1}`}
        />
      ))}
    </div>
  )
}

export default LoaderAnimation
