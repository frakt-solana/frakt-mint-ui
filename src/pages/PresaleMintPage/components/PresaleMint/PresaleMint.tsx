import { useWallet } from '@solana/wallet-adapter-react'
import classNames from 'classnames'

import NotConnectedState from '@frakt/pages/RootPage/views/LiveMint/components/MintForNFTs/NotConnectedState'
import RevealAnimation from '@frakt/pages/RootPage/components/RevealAnimation'
import { LoadingModal } from '@frakt/components/LoadingModal'
import { StatsValues } from '@frakt/components/StatsValues'
import Checkbox from '@frakt/components/Checkbox'
import Button from '@frakt/components/Button'
import Field from '@frakt/components/Field'

import { usePresaleMint } from './hooks/usePresaleMint'
import styles from './PresaleMint.module.scss'

const MAX_FIELD_VALUE_FOR_SINGLE_MINT = 1

const PresaleMint = () => {
  const { connected } = useWallet()
  const {
    onSubmit,
    showReveal,
    isLoading,
    handleResetAnimation,
    whitelistTokenAmount,
    isBulkMint,
    handleToggleBulkMint,
    inputValue,
    onChangeInputValue,
    loadingModalVisible,
    mintedNft,
    showConnectedState,
  } = usePresaleMint()

  const whitelistTokenExistAndSingleMint = whitelistTokenAmount && !isBulkMint

  const fieldValue = whitelistTokenExistAndSingleMint
    ? MAX_FIELD_VALUE_FOR_SINGLE_MINT?.toString()
    : inputValue

  const fieldLpBalance = whitelistTokenExistAndSingleMint
    ? MAX_FIELD_VALUE_FOR_SINGLE_MINT
    : whitelistTokenAmount

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
          <Checkbox
            className={styles.checkbox}
            onChange={handleToggleBulkMint}
            checked={isBulkMint}
            label="Disable animation to bulk mint"
          />
          <div className={styles.container}>
            <h4 className={styles.title}>Mint with presale tokens</h4>
            <div className={styles.content}>
              <p className={classNames(styles.subtitle)}>
                You have {whitelistTokenAmount || 0} presale tokens
              </p>
              {isBulkMint && (
                <Field
                  className={styles.field}
                  value={fieldValue}
                  lpBalance={fieldLpBalance}
                  onValueChange={onChangeInputValue}
                  placeholder="0"
                  integerOnly
                />
              )}
            </div>
            <StatsValues label="Mint price" value={0} />
            <StatsValues label="Will be received">
              {inputValue || 0} BANX
            </StatsValues>
            <Button
              onClick={onSubmit}
              disabled={!parseFloat(inputValue) || !whitelistTokenAmount}
              className={styles.button}
              type="secondary"
            >
              Mint
            </Button>
          </div>
        </>
      )}
      {!connected && <NotConnectedState />}
      <LoadingModal
        visible={loadingModalVisible}
        title="Please approve transaction"
      />
    </>
  )
}

export default PresaleMint
