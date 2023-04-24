import { FC } from 'react'

import { useWalletModal } from '@frakt/components/WalletContent'
import ConnectButton from '@frakt/components/ConnectButton'
import WalletContent from '@frakt/components/WalletContent'
import ThemeSwitcher from '@frakt/components/ThemeSwitcher'
import { FraktLogo } from '@frakt/icons'

import styles from './Header.module.scss'

const Header: FC = () => {
  const { visible } = useWalletModal()

  return (
    <header className={styles.header}>
      {visible && <WalletContent />}
      <a href={process.env.FRAKT_LANDING_URL} className={styles.logo}>
        <FraktLogo className={styles.logo} />
      </a>
      <div className={styles.widgetContainer}>
        <div className={styles.switcherContainer}>
          <ThemeSwitcher />
        </div>
        <ConnectButton className={styles.walletBtn} />
      </div>
    </header>
  )
}

export default Header
