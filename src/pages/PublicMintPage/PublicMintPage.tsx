import AppLayout from '@frakt/layouts/AppLayout'

import DefaultMint from './components/DefaultMint/DefaultMint'
import WhitelistMint from './components/WhitelistMint'
import styles from './PublicMintPage.module.scss'
import { useHeaderAudio } from '@frakt/layouts/Header/Header'
import { useLayoutEffect } from 'react'

import bgLooped from '@frakt/sounds/backgroundSound.mp3'
import { Howl } from 'howler'
import { useFetchTotalMinted } from '@frakt/api/nft'

const PublicMintPage = () => {
  const { isAudioOn } = useHeaderAudio()
  const { data } = useFetchTotalMinted()

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
        <WhitelistMint totalMinted={data?.count || 0} />
        {/* <DefaultMint /> */}
      </div>
    </AppLayout>
  )
}

export default PublicMintPage
