import { BulkMintButtons, BulkMintStats, ColumnValue } from './BulkComponents'
import styles from './MintForNFTs.module.scss'
import NoSuitableNftsState from './NoSuitableNftsState'
import NotConnectedState from './NotConnectedState'
import { useMintForNFTs } from './hooks'
import { NFT } from '@frakt/api/nft'
import { Button } from '@frakt/components/Button'
import Checkbox from '@frakt/components/Checkbox/Checkbox'
import { Loader } from '@frakt/components/Loader'
import { LoadingModal } from '@frakt/components/LoadingModal'
import { useHeaderAudio } from '@frakt/layouts/Header/Header'
import RevealAnimation from '@frakt/pages/RootPage/components/RevealAnimation/RevealAnimation'
import bgLooped from '@frakt/sounds/backgroundSound.mp3'
import { useWallet } from '@solana/wallet-adapter-react'
import classNames from 'classnames'
import { Howl } from 'howler'
import { useLayoutEffect } from 'react'

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

  const { isAudioOn } = useHeaderAudio()

  useLayoutEffect(() => {
    if (isAudioOn) {
      const sound = new Howl({
        src: [bgLooped],
        loop: true,
        volume: 0.25,
      })

      sound.play()

      return () => {
        sound.stop()
      }
    }
  }, [isAudioOn])

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
