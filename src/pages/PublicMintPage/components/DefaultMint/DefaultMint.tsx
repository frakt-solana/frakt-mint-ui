import RevealAnimation from '@frakt/pages/RootPage/components/RevealAnimation'
import Heading from '@frakt/pages/RootPage/components/Heading'
import { StatsValues } from '@frakt/components/StatsValues'
import { Button } from '@frakt/components/Button'
import { MINT_PRICE } from '@frakt/constants'

import { usePublicMint } from './hooks'

import styles from './DefaultMint.module.scss'
import NotConnectedState from '@frakt/pages/RootPage/views/LiveMint/components/MintForNFTs/NotConnectedState'
import { useWallet } from '@solana/wallet-adapter-react'

const DefaultMint = () => {
  const { connected } = useWallet()

  const {
    mintedNft,
    showConnectedState,
    onSubmit,
    showReveal,
    isLoading,
    handleResetAnimation,
  } = usePublicMint()

  return (
    <>
      {showReveal && (
        <RevealAnimation
          handleResetAnimation={handleResetAnimation}
          mintedNft={mintedNft}
          isLoading={isLoading}
        />
      )}
      {showConnectedState && (
        <>
          <Heading />
          <div className={styles.content}>
            <StatsValues label="Mint price" value={MINT_PRICE} />
            <Button
              onClick={onSubmit}
              type="secondary"
              className={styles.button}
            >
              Mint
            </Button>
          </div>
        </>
      )}
      {!connected && <NotConnectedState />}
    </>
  )
}

export default DefaultMint
