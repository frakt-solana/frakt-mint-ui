import { useWallet } from '@solana/wallet-adapter-react'

import NotConnectedState from '@frakt/pages/RootPage/views/LiveMint/components/MintForNFTs/NotConnectedState'
import RevealAnimation from '@frakt/pages/RootPage/components/RevealAnimation'
import { LoadingModal } from '@frakt/components/LoadingModal'
import { StatsValues } from '@frakt/components/StatsValues'
import Checkbox from '@frakt/components/Checkbox'
import Button from '@frakt/components/Button'
import Field from '@frakt/components/Field'

import styles from './WhitelistMint.module.scss'
import BondsModal from '../BondsModal/BondsModal'
import { useWhitelistMint } from '../../hooks/useWhitelistMint'
import { MINT_PRICE } from '@frakt/constants'
import { useState } from 'react'

const MAX_FIELD_VALUE_FOR_SINGLE_MINT = 1

const WhitelistMint = () => {
  const { connected } = useWallet()

  const {
    onSubmit,
    showReveal,
    isLoading,
    isBulkMint,
    loadingModalVisible,
    handleResetAnimation,
    whitelistTokenAmount,
    handleToggleBulkMint,
    inputValue,
    onChangeInputValue,
    mintedNft,
    showConnectedState,
  } = useWhitelistMint()

  const [visibleBondsModal, setVisibleBondsModal] = useState(false)

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
            <h4 className={styles.title}>Mint with WL</h4>
            <div className={styles.content}>
              <p className={styles.subtitle}>
                You have {whitelistTokenAmount} WL tokens
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
            <StatsValues label="Mint price" value={MINT_PRICE} />
            <div className={styles.buttonWrapper}>
              <Button
                onClick={() => setVisibleBondsModal(true)}
                className={styles.button}
                type="secondary"
              >
                Borrow to mint
              </Button>
              <Button
                onClick={onSubmit}
                disabled={!parseFloat(inputValue) || !whitelistTokenAmount}
                className={styles.button}
                type="secondary"
              >
                Mint
              </Button>
            </div>
          </div>
        </>
      )}
      {!connected && <NotConnectedState />}
      <LoadingModal
        visible={loadingModalVisible}
        title="Please approve transaction"
      />
      <BondsModal
        open={visibleBondsModal}
        onCancel={() => setVisibleBondsModal(false)}
      />
    </>
  )
}

export default WhitelistMint
