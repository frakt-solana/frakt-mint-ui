import { FC } from 'react'

import { useWalletModal } from '@frakt/components/WalletContent'
import { Button } from '@frakt/components/Button'

import Gnomie from '@frakt/icons/GnomieCollection.png'
import Banx from '@frakt/icons/BanxCollection.png'
import Frakt from '@frakt/icons/FraktCollection.png'
import Background from '@frakt/icons/Background.png'

import styles from './MintForNFTs.module.scss'

const NotConnectedState: FC = () => {
  const { toggleVisible } = useWalletModal()

  return (
    <>
      <h2 className={styles.heading}>Connect wallet to reveal your banx</h2>
      <div
        className={styles.notConnectedContainer}
        style={{ backgroundImage: `url(${Background})` }}
      >
        <img className={styles.notConnectedSmallImage} src={Frakt} />
        <img className={styles.notConnectedImage} src={Banx} />
        <img className={styles.notConnectedSmallImage} src={Gnomie} />
      </div>
      <Button
        className={styles.connectButton}
        type="secondary"
        onClick={toggleVisible}
      >
        Connect wallet
      </Button>
    </>
  )
}

export default NotConnectedState
