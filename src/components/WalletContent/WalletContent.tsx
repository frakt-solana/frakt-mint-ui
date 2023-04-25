import { FC, useRef } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'

import { useOnClickOutside } from '@frakt/hooks'

import { WalletItem } from './WalletItem'
import { useWalletModal } from './hooks'

import styles from './styles.module.scss'
import { Button } from '../Button'

interface WalletContentProps {
  className?: string
}

export const WalletsItems: FC = () => {
  const { wallets, select } = useWallet()
  const { setVisible } = useWalletModal()

  return (
    <div className={styles.itemsContainer}>
      {wallets.map(({ adapter }, idx) => (
        <WalletItem
          key={idx}
          onClick={(): void => {
            select(adapter.name)
            setVisible(false)
          }}
          imageSrc={adapter.icon}
          imageAlt={adapter.name}
          name={adapter.name}
        />
      ))}
    </div>
  )
}

const DisconnecWalletContent: FC = () => {
  const { disconnect } = useWallet()

  return (
    <div className={styles.disconnectContainer}>
      <Button
        className={styles.disconnectButton}
        type="secondary"
        onClick={disconnect}
      >
        Disconnect
      </Button>
    </div>
  )
}

const WalletContent: FC<WalletContentProps> = ({ className = '' }) => {
  const { setVisible } = useWalletModal()
  const { connected } = useWallet()

  const ref = useRef()
  useOnClickOutside(ref, () => setVisible(false))

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <div className={styles.overlay} onClick={() => setVisible(false)} />
      <div ref={ref} className={`${styles.container} container`}>
        {connected ? <DisconnecWalletContent /> : <WalletsItems />}
      </div>
    </div>
  )
}

export default WalletContent
