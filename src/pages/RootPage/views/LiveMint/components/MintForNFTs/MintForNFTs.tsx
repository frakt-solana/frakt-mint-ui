import { FC } from 'react'

import { GoBackButton } from '@frakt/components/GoBackButton'
import { StatsValues } from '@frakt/components/StatsValues'
import { Button } from '@frakt/components/Button'
import { MINT_PRICE } from '@frakt/constants'

import styles from './MintForNFTs.module.scss'

const MintForNFTs: FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className={styles.container}>
      <GoBackButton onClick={onBack} />
      <h4 className={styles.title}>Mint with frakts or gnomies</h4>
      <div className={styles.nftList}></div>
      <StatsValues label="Mint price" value={MINT_PRICE} />
      <StatsValues label="Will be received">0 BANX</StatsValues>
      <div className={styles.buttonWrapper}>
        <Button className={styles.button}>Select all</Button>
        <Button className={styles.button} type="primary" disabled>
          Mint
        </Button>
      </div>
    </div>
  )
}

export default MintForNFTs
