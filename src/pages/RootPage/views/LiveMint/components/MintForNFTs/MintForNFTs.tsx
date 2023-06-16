import { useWallet } from '@solana/wallet-adapter-react'
import classNames from 'classnames'

import RevealAnimation from '@frakt/pages/RootPage/components/RevealAnimation/RevealAnimation'
import Checkbox from '@frakt/components/Checkbox/Checkbox'
import { Button } from '@frakt/components/Button'
import { Loader } from '@frakt/components/Loader'
import { NFT } from '@frakt/api/nft'

import { BulkMintButtons, BulkMintStats, ColumnValue } from './BulkComponents'
import { useMintForNFTs } from './hooks'

import styles from './MintForNFTs.module.scss'
import NotConnectedState from './NotConnectedState'
import NoSuitableNftsState from './NoSuitableNftsState'
import { LoadingModal } from '@frakt/components/LoadingModal'

const MintForNFTs = () => {
  const { connected } = useWallet()

  const {
    nfts,
    onSelectNFTs,
    findLoanInSelection,
    selection,
    selectedNFT,
    mintedNft,

    isBulkMint,
    isLoading,
    loadingModalVisible,

    onSubmit,
    handleResetAnimation,
    handeSelectNFt,
    handleToggleBulkMint,

    showNoSuitableNftsState,
    showContent,
    showReveal,
    showLoader,
  } = useMintForNFTs()

  return (
    <>
      {showReveal && (
        <RevealAnimation
          handleResetAnimation={handleResetAnimation}
          selectedNftImage={selectedNFT?.imageUrl}
          mintedNft={mintedNft}
          isLoading={isLoading}
        />
      )}
      {showLoader && <Loader />}
      {showNoSuitableNftsState && <NoSuitableNftsState />}
      {!connected && <NotConnectedState />}

      {showContent && (
        <>
          <h2 className={styles.heading}>Tap on selected NFT to reveal</h2>
          <Checkbox
            onChange={handleToggleBulkMint}
            checked={isBulkMint}
            label="Disable animation to bulk mint"
          />
          <div className={styles.wrapper}>
            {!isBulkMint && (
              <div className={styles.cardWrapper}>
                <div className={styles.card}>
                  <img src={selectedNFT?.imageUrl} />
                </div>
                <Button
                  onClick={onSubmit}
                  className={styles.revealButton}
                  disabled={!selection?.length}
                  type="secondary"
                >
                  Reveal
                </Button>
              </div>
            )}

            <div className={styles.container}>
              <div
                className={classNames(styles.nftList, {
                  [styles.emptyList]: !nfts.length,
                  [styles.isBulkMint]: isBulkMint,
                })}
              >
                {!nfts.length && connected && <Loader />}
                {nfts.map((nft) => (
                  <NftCard
                    key={nft?.mint}
                    nft={nft}
                    selected={!!findLoanInSelection(nft.mint)}
                    onClick={() => handeSelectNFt(nft)}
                  />
                ))}
              </div>
            </div>
          </div>

          {!isBulkMint && (
            <ColumnValue label="Total NFTS" value={nfts?.length} />
          )}

          {isBulkMint && (
            <BulkMintStats
              totalSelectedNfts={selection?.length}
              totalNfts={nfts?.length}
            />
          )}

          {isBulkMint && (
            <BulkMintButtons
              onSelectNFTs={onSelectNFTs}
              onSubmit={onSubmit}
              selection={selection}
              nfts={nfts}
            />
          )}
        </>
      )}
      <LoadingModal
        title="Please approve transaction"
        visible={loadingModalVisible}
      />
    </>
  )
}

export default MintForNFTs

const NftCard = ({
  nft,
  selected,
  onClick,
}: {
  nft: NFT
  selected: boolean
  onClick: () => void
}) => {
  return (
    <div onClick={onClick} className={styles.nftCard} key={nft?.mint}>
      <div className={styles.collectionImageWrapper}>
        <img src={nft?.imageUrl} className={styles.collectionImage} />
        {selected && <div className={styles.selectedCollectionOverlay}></div>}
      </div>
    </div>
  )
}
