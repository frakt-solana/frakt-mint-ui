import { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import classNames from 'classnames'

import LoaderAnimation from '@frakt/pages/RootPage/components/LoaderAnimation/LoaderAnimation'
import OpenAnimaion from '@frakt/pages/RootPage/components/OpenAnimaion/OpenAnimaion'
import Checkbox from '@frakt/components/Checkbox/Checkbox'
import { Button } from '@frakt/components/Button'
import { Loader } from '@frakt/components/Loader'
import { NFT } from '@frakt/api/nft'

import { useMintForNFTs } from './hooks'

import styles from './MintForNFTs.module.scss'
import { BulkMintButtons, BulkMintStats, ColumnValue } from './BulkComponents'

const RECEIVED_NFT_IMAGE = 'https://pbs.twimg.com/media/FuaAl7sXoAIm_jk.png'

const MintForNFTs = () => {
  const { connected } = useWallet()

  const [checked, setChecked] = useState<boolean>(false)
  const isBulkMint = !!checked

  const {
    nfts,
    toggleLoanInSelection,
    findLoanInSelection,
    onSelectNFTs,
    selection,
    onSubmit,
    clearSelection,
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
    setChecked(!checked)
  }

  const defaultImage = selection?.length
    ? selection[0]?.imageUrl
    : nfts[0]?.imageUrl

  const [showReveal, setShowReveal] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    if (showReveal) {
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 3000)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [showReveal])

  return (
    <>
      {isLoading && showReveal && <LoaderAnimation />}
      {showReveal && !isLoading && (
        <OpenAnimaion
          selectedNftImage={selection[0]?.imageUrl}
          isStartAnimation={showReveal}
          receivedNftImage={RECEIVED_NFT_IMAGE}
        />
      )}
      {!showReveal && (
        <>
          <h2 className={styles.heading}>Tap on selected NFT to reveal</h2>
          <Checkbox
            onChange={handleChecked}
            checked={checked}
            label="Disable animation to bulk mint"
          />
          <div className={styles.wrapper}>
            {!isBulkMint && (
              <div className={styles.cardWrapper}>
                <div className={styles.card}>
                  <img src={defaultImage} />
                </div>
                <Button
                  onClick={() => setShowReveal(true)}
                  className={styles.revealButton}
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
