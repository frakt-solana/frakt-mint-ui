import { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'

import { NFT } from '@frakt/api/nft'

import { useMintTransactions } from './useMintTransactions'
import { useSelectedNFTs } from './../nftsState'
import { useWalletNfts } from './useWalletNfts'

export const useMintForNFTs = () => {
  const wallet = useWallet()
  const { connected } = useWallet()

  const { nfts, hideNFT, isLoading: nftsLoading } = useWalletNfts()

  const [isBulkMint, setIsBulkMint] = useState<boolean>(false)

  const {
    selection,
    toggleNftInSelection,
    clearSelection,
    findLoanInSelection,
    setSelection,
  } = useSelectedNFTs()

  const selectedNFT = selection[0]

  useEffect(() => {
    if (!selection?.length && !!nfts?.length && !isBulkMint) {
      toggleNftInSelection(nfts[0])
    }
  }, [nfts, isBulkMint, selection])

  useEffect(() => {
    clearSelection()
  }, [wallet?.publicKey])

  const handeSelectNFt = (nft: NFT) => {
    if (!isBulkMint) {
      clearSelection()
      toggleNftInSelection(nft)
    } else {
      toggleNftInSelection(nft)
    }
  }

  const handleToggleBulkMint = () => {
    clearSelection()
    setIsBulkMint(!isBulkMint)
  }

  const {
    onBulkMint,
    onSingleMint,
    isLoading,
    isStartAnimation,
    mintedNft,
    handleResetAnimation,
  } = useMintTransactions({
    selection,
    hideNFT,
    clearSelection,
  })

  const onSelectNFTs = () => {
    if (selection.length) {
      clearSelection()
    } else {
      setSelection(nfts)
    }
  }

  const isConnectedAndNotLoading = connected && !nftsLoading && !isLoading
  const showConnectedState = isConnectedAndNotLoading && !isStartAnimation
  const showNoSuitableNftsState = showConnectedState && !nfts?.length
  const showContent = showConnectedState && !!nfts?.length
  const showReveal = isStartAnimation || isLoading
  const showLoader = nftsLoading && connected

  return {
    nfts,
    onSelectNFTs,
    findLoanInSelection,
    selection,
    selectedNFT,
    mintedNft,

    isBulkMint,
    isLoading,

    onSubmit: isBulkMint ? onBulkMint : onSingleMint,
    handleResetAnimation,
    handeSelectNFt,
    handleToggleBulkMint,

    showNoSuitableNftsState,
    showContent,
    showReveal,
    showLoader,
  }
}
