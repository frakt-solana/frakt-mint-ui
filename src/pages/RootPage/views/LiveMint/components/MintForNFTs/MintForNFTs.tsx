import { FC } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import classNames from 'classnames'

import { GoBackButton } from '@frakt/components/GoBackButton'
import { StatsValues } from '@frakt/components/StatsValues'
import { Button } from '@frakt/components/Button'
import { Loader } from '@frakt/components/Loader'
import { MINT_PRICE } from '@frakt/constants'

import { useMintForNFTs } from './hooks'

import styles from './MintForNFTs.module.scss'
import { NFT } from '@frakt/api/nft'

const MintForNFTs: FC<{ onBack: () => void }> = ({ onBack }) => {
  const { connected } = useWallet()
  const {
    nfts,
    toggleLoanInSelection,
    findLoanInSelection,
    onSelectNFTs,
    selection,
    onSubmit,
  } = useMintForNFTs()

  return (
    <div className={styles.container}>
      <GoBackButton onClick={onBack} />
      <h4 className={styles.title}>Mint with frakts or gnomies</h4>
      <div
        className={classNames(styles.nftList, {
          [styles.emptyList]: !nfts.length,
        })}
      >
        {!nfts.length && connected && <Loader />}
        {nfts.map((nft) => (
          <NftCard
            nft={nft}
            selected={!!findLoanInSelection(nft.mint)}
            onClick={() => toggleLoanInSelection(nft)}
          />
        ))}
      </div>
      <StatsValues label="Mint price" value={MINT_PRICE} />
      <StatsValues label="Will be received">0 BANX</StatsValues>
      <div className={styles.buttonWrapper}>
        <Button
          onClick={onSelectNFTs}
          disabled={!nfts.length}
          className={styles.button}
        >
          {selection.length ? 'Deselect all' : 'Select all'}
        </Button>
        <Button
          onClick={onSubmit}
          className={styles.button}
          type="primary"
          disabled={!selection.length}
        >
          Mint
        </Button>
      </div>
    </div>
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
