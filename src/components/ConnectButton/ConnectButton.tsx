import { FC } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'

// import { shortenAddress } from '@frakt/utils/solanaUtils'
import styles from './ConnectButton.module.scss'
// import { ArrowDownBtn } from '@frakt/icons'

export interface ConnectButtonProps {
  className?: string
}

const ConnectButton: FC<ConnectButtonProps> = () => {
  const { publicKey: walletPubKey, connected } = useWallet()

  return (
    <button
      className={styles.container}
      // onClick={() => {
      //   dispatch(commonActions.toggleWalletModal())
      // }}
    >
      {connected && (
        <>
          {/* {shortenAddress(walletPubKey?.toString())} */}
          {/* <ArrowDownBtn className={styles.arrowDownIcon} /> */}
        </>
      )}
      {!connected && 'Connect Wallet'}
    </button>
  )
}

export default ConnectButton
