import AppLayout from '@frakt/layouts/AppLayout'

import DefaultMint from './components/DefaultMint/DefaultMint'
import WhitelistMint from './components/WhitelistMint'
import styles from './PublicMintPage.module.scss'
import { useHeaderAudio } from '@frakt/layouts/Header/Header'
import { useLayoutEffect } from 'react'

import bgLooped from '@frakt/sounds/backgroundSound.mp3'
import { Howl } from 'howler'

const PublicMintPage = () => {
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
        {/* <DefaultMint /> */}
      </div>
    </AppLayout>
  )
}

export default PublicMintPage
