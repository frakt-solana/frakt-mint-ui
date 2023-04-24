import { FC } from 'react'

import { GoBackButton } from '@frakt/components/GoBackButton'
import { StatsValues } from '@frakt/components/StatsValues'
import Button from '@frakt/components/Button'
import { MINT_PRICE } from '@frakt/constants'
import Field from '@frakt/components/Field'

import styles from './WhitelistMint.module.scss'

const WhitelistMint: FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className={styles.container}>
      <GoBackButton onClick={onBack} />
      <h4 className={styles.title}>Mint with WL</h4>
      <div className={styles.content}>
        <p>You have 5 WL tokens</p>
      </div>
      <Field value={'10'} onValueChange={null} />
      <StatsValues label="Mint price" value={MINT_PRICE} />
      <StatsValues label="Will be received">0 BANX</StatsValues>
      <Button className={styles.button} type="secondary">
        Mint
      </Button>
    </div>
  )
}

export default WhitelistMint
