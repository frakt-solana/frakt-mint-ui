import { FC, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import classNames from 'classnames'

import Checkbox from '@frakt/components/Checkbox/Checkbox'
import { Button } from '@frakt/components/Button'
import { Loader } from '@frakt/components/Loader'
import { NFT } from '@frakt/api/nft'

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
  } = useMintForNFTs()

  const [checked, setChecked] = useState<boolean>(false)

  const isBulkMint = !!checked

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

  return (
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
            <Button className={styles.revealButton} type="secondary">
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
        <div className={styles.stats}>
          <ColumnValue
            label="Nfts selected"
            value={`${selection?.length}/${nfts?.length}`}
          />
          <ColumnValue label="Banx minted" value={`${0}/${nfts?.length}`} />
        </div>
      )}
      {isBulkMint && (
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
      )}
    </>
  )
}

export default MintForNFTs

const ColumnValue = ({ label, value }) => (
  <div className={styles.columnValue}>
    <span className={styles.value}>{value}</span>
    <span className={styles.label}>{label}</span>
  </div>
)

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
