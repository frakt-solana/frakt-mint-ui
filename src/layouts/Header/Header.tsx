import styles from './Header.module.scss'
import Button from '@frakt/components/Button'
import ConnectButton from '@frakt/components/ConnectButton'
import ThemeSwitcher from '@frakt/components/ThemeSwitcher'
import { useWalletModal } from '@frakt/components/WalletContent'
import WalletContent from '@frakt/components/WalletContent'
import { AudioOff, AudioOn, FraktLogo } from '@frakt/icons'
import { FC } from 'react'
import { Outlet } from 'react-router-dom'
import { create } from 'zustand'

const Header: FC = () => {
  const { visible } = useWalletModal()

  const { isAudioOn, toggleAudio } = useHeaderAudio()

  const handleButtonClick = () => {
    toggleAudio()
  }

  return (
    <>
      <header className={styles.header}>
        {visible && <WalletContent />}
        <a href={process.env.FRAKT_LANDING_URL} className={styles.logo}>
          <FraktLogo className={styles.logo} />
        </a>
        <div className={styles.widgetContainer}>
          <div className={styles.switcherContainer}>
            <ThemeSwitcher />
          </div>
          <Button
            className={styles.soundButton}
            type="tertiary"
            onClick={handleButtonClick}
          >
            {isAudioOn ? <AudioOn /> : <AudioOff />}
          </Button>
          <ConnectButton className={styles.walletBtn} />
        </div>
      </header>
      <Outlet />
    </>
  )
}

export default Header

type HeaderStore = {
  isAudioOn: boolean
  toggleAudio: () => void
}

export const useHeaderAudio = create<HeaderStore>((set) => ({
  isAudioOn: true,
  toggleAudio: () => set((state) => ({ isAudioOn: !state.isAudioOn })),
}))
