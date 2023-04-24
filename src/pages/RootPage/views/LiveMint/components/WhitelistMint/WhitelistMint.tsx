import { FC } from 'react'

import styles from './WhitelistMint.module.scss'
import Button from '@frakt/components/Button'
import { StatsValues } from '@frakt/components/StatsValues'
import { MINT_PRICE } from '@frakt/constants'

const WhitelistMint: FC = () => {
  return (
    <div className={styles.container}>
      <h4 className={styles.title}>Mint with WL</h4>
      <div className={styles.content}>
        <p>You have 5 WL tokens</p>
      </div>
      <StatsValues label="Mint price" value={MINT_PRICE} />
      <StatsValues label="Will be received">0 BANX</StatsValues>
      <Button className={styles.button} type="secondary">
        Mint
      </Button>
    </div>
  )
}

export default WhitelistMint
