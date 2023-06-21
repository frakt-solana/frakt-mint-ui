import { FC } from 'react'

import { useWalletModal } from '@frakt/components/WalletContent'
import { Button } from '@frakt/components/Button'

import Banx from '@frakt/icons/BanxCollection.png'

import styles from './MintForNFTs.module.scss'

const NotConnectedState: FC = () => {
  const { toggleVisible } = useWalletModal()

  return (
    <>
      <h2 className={styles.heading}>Connect wallet to mint your banx</h2>
      <div className={styles.notConnectedContainer}>
        <img className={styles.notConnectedImage} src={Banx} />
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
