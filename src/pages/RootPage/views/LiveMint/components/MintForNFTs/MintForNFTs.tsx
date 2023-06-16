import { useWallet } from '@solana/wallet-adapter-react'
import classNames from 'classnames'

import OpenAnimaion from '@frakt/pages/RootPage/components/OpenAnimaion/OpenAnimaion'
import Checkbox from '@frakt/components/Checkbox/Checkbox'
import { Button } from '@frakt/components/Button'
import { Loader } from '@frakt/components/Loader'
import { NFT } from '@frakt/api/nft'

import { BulkMintButtons, BulkMintStats, ColumnValue } from './BulkComponents'
import { useMintForNFTs } from './hooks'

import styles from './MintForNFTs.module.scss'

const MintForNFTs = () => {
  const { connected } = useWallet()

  const {
    nfts,
    toggleLoanInSelection,
    findLoanInSelection,
    onSelectNFTs,
    selection,
    onSubmit,
    clearSelection,
    isBulkMint,
    setIsBulkMint,
    isLoading,
    isStartAnimation,
    defaultImage,
    mintedNft,
    selectedNft,
  } = useMintForNFTs()

  const handeSelectNFt = (nft: NFT) => {
    if (!isBulkMint) {
      clearSelection()
      toggleLoanInSelection(nft)
    } else {
      toggleLoanInSelection(nft)
    }
  }

  const handleChecked = () => {
    clearSelection()
    setIsBulkMint(!isBulkMint)
  }

  return (
    <>
      {(isStartAnimation || isLoading) && (
        <OpenAnimaion
          selectedNftImage={selectedNft?.imageUrl}
          isStartAnimation={isStartAnimation}
          mintedNft={mintedNft}
          isLoading={isLoading}
        />
      )}
      {!isStartAnimation && !isLoading && (
        <>
          <h2 className={styles.heading}>Tap on selected NFT to reveal</h2>
          <Checkbox
            onChange={handleChecked}
            checked={isBulkMint}
            label="Disable animation to bulk mint"
          />
          <div className={styles.wrapper}>
            {!isBulkMint && (
              <div className={styles.cardWrapper}>
                <div className={styles.card}>
                  <img src={defaultImage} />
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
            <ColumnValue label="Banx minted" value={`${0}/${nfts?.length}`} />
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
