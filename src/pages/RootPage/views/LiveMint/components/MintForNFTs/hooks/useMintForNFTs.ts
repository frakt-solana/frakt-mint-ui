import { useEffect, useState } from 'react'
import { TokenStandard } from '@metaplex-foundation/mpl-token-metadata'
import { setComputeUnitLimit } from '@metaplex-foundation/mpl-essentials'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import {
  generateSigner,
  publicKey,
  some,
  transactionBuilder,
  base58PublicKey,
} from '@metaplex-foundation/umi'
import {
  fetchCandyGuard,
  fetchCandyMachine,
  mintV2,
} from '@metaplex-foundation/mpl-candy-machine'

import { CANDY_MACHINE_PUBKEY, DESTINATION_PUBKEY } from '@frakt/constants'
import { throwLogsError } from '@frakt/utils'
import { useUmi } from '@frakt/helpers/umi'

import { useSelectedNFTs } from './../nftsState'
import { useWalletNfts } from './useWalletNfts'
import {
  MintedNft,
  getCertainGroupByNft,
  getMetadataByCertainNft,
} from '../helpers'
import {
  buildMintTransaction,
  makeMintTransaction,
} from '@frakt/utils/transactions/makeMintTransaction'

export const useMintForNFTs = () => {
  const { connection } = useConnection()
  const wallet = useWallet()

  const { nfts, hideNFT, isLoading: nftsLoading } = useWalletNfts()
  const umi = useUmi()

  const [isBulkMint, setIsBulkMint] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isStartAnimation, setIsStartAnimation] = useState<boolean>(false)

  const [mintedNft, setMintedNft] = useState<MintedNft>(null)

  const {
    selection,
    toggleLoanInSelection,
    clearSelection,
    findLoanInSelection,
    setSelection,
  } = useSelectedNFTs()

  useEffect(() => {
    if (!selection?.length && nfts?.length && !isBulkMint) {
      toggleLoanInSelection(nfts[0])
    }
  }, [nfts, isBulkMint, selection])

  useEffect(() => {
    clearSelection()
  }, [wallet?.publicKey])

  const selectedNft = selection[0]

  const defaultImage = selection?.length
    ? selectedNft?.imageUrl
    : nfts[0]?.imageUrl

  const onSelectNFTs = (): void => {
    if (selection.length) {
      clearSelection()
    } else {
      setSelection(nfts)
    }
  }

  const handleResetAnimation = () => {
    setIsStartAnimation(false)
    setIsLoading(false)
    clearSelection()
  }

  const onSingleMint = async () => {
    try {
      setIsLoading(true)

      //TODO: need fetch ceartain CANDY_MACHINE_PUBKEY for each nft

      const group = getCertainGroupByNft(selectedNft)

      const { transaction, nftSigner } = await buildMintTransaction({
        umi,
        group,
        candyMachineAddress: CANDY_MACHINE_PUBKEY,
        selectedNftMint: selectedNft?.mint,
      })

      const { result } = await transaction.sendAndConfirm(umi, {
        confirm: { commitment: 'finalized' },
        send: {
          skipPreflight: true,
        },
      })

      if (result.value.err !== null) {
        console.log('TRANSACTION RESULT: ', result)
        return false
      }

      const receivedNftMint = base58PublicKey(nftSigner?.publicKey?.bytes)
      const nft = await getMetadataByCertainNft({
        nftMint: receivedNftMint,
        connection,
      })

      if (!nft?.mint) {
        return false
      }

      setMintedNft(nft)
      hideNFT(selectedNft?.mint)
      setIsStartAnimation(true)
    } catch (error) {
      throwLogsError(error)
      setIsLoading(false)
    } finally {
      setIsLoading(false)
    }
  }

  const onBulkMint = async () => {
    try {
      const mintTransactions = []

      for (const nft of selection) {
        try {
          const group = getCertainGroupByNft(nft)

          const transaction = await makeMintTransaction({
            umi,
            group,
            candyMachineAddress: CANDY_MACHINE_PUBKEY,
            selectedNftMint: nft?.mint,
          })
          mintTransactions.push(transaction)
        } catch (error) {
          console.log(`Error processing item: ${nft}`)
          console.log(error)
        }
      }

      const signedTransactions = await wallet.signAllTransactions(
        mintTransactions,
      )

      const txids = await Promise.all(
        signedTransactions.map((signedTransaction) =>
          connection.sendRawTransaction(signedTransaction.serialize()),
        ),
      )

      await new Promise((r) => setTimeout(r, 7000))
    } catch (error) {
      console.log(error)
    }
  }

  return {
    nfts,
    onSelectNFTs,
    toggleLoanInSelection,
    clearSelection,
    findLoanInSelection,
    selection,
    onSubmit: isBulkMint ? onBulkMint : onSingleMint,
    isBulkMint,
    setIsBulkMint,
    isLoading,
    isStartAnimation,
    defaultImage,
    mintedNft,
    selectedNft,
    handleResetAnimation,
    nftsLoading,
  }
}
