import { FC } from 'react'

import ConnectButton from '@frakt/components/ConnectButton'
import ThemeSwitcher from '@frakt/components/ThemeSwitcher'
import { FraktLogo } from '@frakt/icons'

import styles from './Header.module.scss'

const Header: FC = () => {
  return (
    <header className={styles.header}>
      {/* {visible && <WalletContent />} */}
      <a href={process.env.FRAKT_LANDING_URL} className={styles.logo}>
        <FraktLogo className={styles.logo} />
      </a>
      <div className={styles.widgetContainer}>
        <div className={styles.switcherContainer}>
          <ThemeSwitcher />
        </div>
        {/* <FraktLogo className={styles.logo} /> */}
        <ConnectButton className={styles.walletBtn} />
      </div>
    </header>
  )
}

export default Header
