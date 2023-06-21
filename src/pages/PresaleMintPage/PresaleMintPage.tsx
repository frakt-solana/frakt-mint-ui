import { FC, useLayoutEffect } from 'react'
import { Howl } from 'howler'

import { useHeaderAudio } from '@frakt/layouts/Header/Header'
import AppLayout from '@frakt/layouts/AppLayout/AppLayout'
import bgLooped from '@frakt/sounds/backgroundSound.mp3'
import PresaleMint from './components/PresaleMint'

import styles from './PresaleMintPage.module.scss'

const PresaleMintPage: FC = () => {
  const { isAudioOn } = useHeaderAudio()

  useLayoutEffect(() => {
    if (isAudioOn) {
      const sound = new Howl({
        src: [bgLooped],
        loop: true,
        volume: 0.25,
      })

      sound.play()

      return () => {
        sound.stop()
      }
    }
  }, [isAudioOn])

  return (
    <AppLayout>
      <div className={styles.container}>
        <PresaleMint />
      </div>
    </AppLayout>
  )
}
export default PresaleMintPage
