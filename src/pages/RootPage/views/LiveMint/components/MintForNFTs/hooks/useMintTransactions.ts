import {
  buildMintTransaction,
  makeMintTransaction,
} from '@frakt/utils/transactions/makeMintTransaction'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useUmi } from '@frakt/helpers/umi'

import {
  MintedNft,
  getCertainGroupByNft,
  getMetadataByCertainNft,
} from '../helpers'
import { CANDY_MACHINE_PUBKEY } from '@frakt/constants'
import { base58PublicKey } from '@metaplex-foundation/umi'
import { useState } from 'react'
import { throwLogsError } from '@frakt/utils'

export const useMintTransactions = ({ selection, hideNFT, clearSelection }) => {
  const { connection } = useConnection()
  const wallet = useWallet()
  const umi = useUmi()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isStartAnimation, setIsStartAnimation] = useState<boolean>(false)

  const [mintedNft, setMintedNft] = useState<MintedNft>(null)

  const selectedNft = selection[0]

  const handleResetAnimation = () => {
    setIsStartAnimation(false)
    setIsLoading(false)
    clearSelection()
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

  return {
    onBulkMint,
    onSingleMint,
    isLoading,
    isStartAnimation,
    mintedNft,
    handleResetAnimation,
  }
}
