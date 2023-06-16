import { FC } from 'react'

import { useWalletModal } from '@frakt/components/WalletContent'
import { Button } from '@frakt/components/Button'

import styles from './MintForNFTs.module.scss'

const NotConnectedState: FC = () => {
  const { toggleVisible } = useWalletModal()

  return (
    <>
      <h2 className={styles.heading}>Connect wallet to reveal your banx</h2>
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
