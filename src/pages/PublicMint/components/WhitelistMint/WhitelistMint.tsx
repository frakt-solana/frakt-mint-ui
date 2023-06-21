import { useState } from 'react'

import { StatsValues } from '@frakt/components/StatsValues'
import { MINT_PRICE } from '@frakt/constants'
import Button from '@frakt/components/Button'
import Field from '@frakt/components/Field'

import styles from './WhitelistMint.module.scss'
import { useWhitelistMint } from './hooks'
import RevealAnimation from '@frakt/pages/RootPage/components/RevealAnimation'

const WhitelistMint = () => {
  const [inputValue, setInputValue] = useState<string>('0')

  const onChangeInputValue = (value: string) => {
    setInputValue(value)
  }

  const {
    onSubmit,
    showReveal,
    isLoading,
    handleResetAnimation,
    whitelistTokenAmount,
  } = useWhitelistMint()

  return (
    <>
      {showReveal ? (
        <RevealAnimation
          handleResetAnimation={handleResetAnimation}
          mintedNft={null}
          isLoading={isLoading}
        />
      ) : (
        <div className={styles.container}>
          <h4 className={styles.title}>Mint with WL</h4>
          <div className={styles.content}>
            <p className={styles.subtitle}>
              You have {whitelistTokenAmount} WL tokens
            </p>
            <Field
              className={styles.field}
              value={inputValue}
              lpBalance={whitelistTokenAmount}
              onValueChange={onChangeInputValue}
            />
          </div>
          <StatsValues label="Mint price" value={MINT_PRICE} />
          <StatsValues label="Will be received">
            {inputValue || 0} BANX
          </StatsValues>
          <Button
            onClick={onSubmit}
            disabled={!parseFloat(inputValue)}
            className={styles.button}
            type="secondary"
          >
            Mint
          </Button>
        </div>
      )}
    </>
  )
}

export default WhitelistMint
