import { FC, useState } from 'react'

import { GoBackButton } from '@frakt/components/GoBackButton'
import { StatsValues } from '@frakt/components/StatsValues'
import { SliderPoint as wlTokenImage } from '@frakt/icons'
import { MINT_PRICE } from '@frakt/constants'
import Button from '@frakt/components/Button'
import Field from '@frakt/components/Field'

import styles from './WhitelistMint.module.scss'

const WhitelistMint: FC<{ onBack: () => void }> = ({ onBack }) => {
  const [inputValue, setInputValue] = useState<string>('0')

  const onChangeInputValue = (value: string) => {
    setInputValue(value)
  }

  return (
    <div className={styles.container}>
      <GoBackButton onClick={onBack} />
      <h4 className={styles.title}>Mint with WL</h4>
      <div className={styles.content}>
        <img className={styles.tokenImage} src={wlTokenImage} />
        <p>You have 5 WL tokens</p>
      </div>
      <Field
        className={styles.field}
        value={inputValue}
        lpBalance={5}
        onValueChange={onChangeInputValue}
      />
      <StatsValues label="Mint price" value={MINT_PRICE} />
      <StatsValues label="Will be received">0 BANX</StatsValues>
      <Button className={styles.button} type="secondary">
        Mint
      </Button>
    </div>
  )
}

export default WhitelistMint
