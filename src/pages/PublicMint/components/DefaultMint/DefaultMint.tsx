import { StatsValues } from '@frakt/components/StatsValues'
import Heading from '@frakt/pages/RootPage/components/Heading'
import { Button } from '@frakt/components/Button'
import { MINT_PRICE } from '@frakt/constants'

import { usePublicMint } from './hooks'

import styles from './DefaultMint.module.scss'
import RevealAnimation from '@frakt/pages/RootPage/components/RevealAnimation'

const DefaultMint = () => {
  const { onSubmit, showReveal, isLoading, handleResetAnimation } =
    usePublicMint()

  return (
    <>
      <Heading />
      <div className={styles.content}>
        <StatsValues label="Mint price" value={MINT_PRICE} />
        <Button onClick={onSubmit} type="secondary" className={styles.button}>
          Mint
        </Button>
      </div>
      {showReveal && (
        <RevealAnimation
          handleResetAnimation={handleResetAnimation}
          mintedNft={null}
          isLoading={isLoading}
        />
      )}
    </>
  )
}

export default DefaultMint
