import { FC, useLayoutEffect } from 'react'
import { Howl } from 'howler'

import AppLayout from '@frakt/layouts/AppLayout/AppLayout'
import bgLooped from '@frakt/sounds/backgroundSound.mp3'
import WhitelistMint from './components/WhitelistMint'

import styles from './PresaleMintPage.module.scss'
import { useHeaderAudio } from '@frakt/layouts/Header/Header'

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
        <WhitelistMint />
      </div>
    </AppLayout>
  )
}
export default PresaleMintPage
