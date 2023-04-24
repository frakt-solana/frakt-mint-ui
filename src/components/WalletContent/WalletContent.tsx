import { FC, useRef } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'

import { useOnClickOutside } from '@frakt/hooks'

import { WalletItem } from './WalletItem'
import { useWalletModal } from './hooks'

import styles from './styles.module.scss'

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

const WalletContent: FC<WalletContentProps> = ({ className = '' }) => {
  const { setVisible } = useWalletModal()

  const ref = useRef()
  useOnClickOutside(ref, () => setVisible(false))

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <div className={styles.overlay} onClick={() => setVisible(false)} />
      <div ref={ref} className={`${styles.container} container`}>
        <WalletsItems />
      </div>
    </div>
  )
}

export default WalletContent
