import { useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { base58PublicKey } from '@metaplex-foundation/umi'

import { CANDY_MACHINE_PUBKEY } from '@frakt/constants'
import { throwLogsError } from '@frakt/utils'
import { useUmi } from '@frakt/helpers/umi'
import {
  buildMintTransaction,
  makeMintTransaction,
} from '@frakt/utils/transactions/makeMintTransaction'

import {
  MintedNft,
  getCertainGroupByNft,
  getMetadataByCertainNft,
} from '../helpers'
import { useLoadingModal } from '@frakt/components/LoadingModal'
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes'
import { mintNftsQuery } from '@frakt/api/nft'

const encodeSignature = (signature) => {
  const buffer = Buffer.from(signature)
  const encodedSignature = bs58.encode(buffer)
  return encodedSignature
}

export const useMintTransactions = ({ selection, hideNFT, clearSelection }) => {
  const { connection } = useConnection()
  const wallet = useWallet()
  const umi = useUmi()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isStartAnimation, setIsStartAnimation] = useState<boolean>(false)

  const {
    visible: loadingModalVisible,
    open: openLoadingModal,
    close: closeLoadingModal,
  } = useLoadingModal()

  const [mintedNft, setMintedNft] = useState<any>(null)

  const selectedNft = selection[0]

  const handleResetAnimation = () => {
    setIsStartAnimation(false)
    setIsLoading(false)
    clearSelection()
  }

  const onBulkMint = async () => {
    openLoadingModal()
    try {
      const mintsTransactionsParams = []

      for (const nft of selection) {
        try {
          const group = getCertainGroupByNft(nft)

          const { transactionMint, nftSigner } = await makeMintTransaction({
            umi,
            group,
            candyMachineAddress: CANDY_MACHINE_PUBKEY,
            selectedNftMint: nft?.mint,
          })

          const metadata = await getMetadataByCertainNft({
            nftMint: selectedNft?.mint,
            connection,
          })

          mintsTransactionsParams.push({
            metadata: metadata?.externalMetadata,
            transaction: transactionMint,
            mint: nftSigner,
            baseNftMint: nft?.mint,
            user: wallet?.publicKey?.toBase58(),
          })
        } catch (error) {
          console.log(`Error processing nft: ${nft}`)
          console.log(error)
        }
      }

      const mintTransactions = mintsTransactionsParams.map(
        ({ transaction }) => transaction,
      )

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
    } finally {
      closeLoadingModal()
    }
  }

  const onSingleMint = async () => {
    try {
      setIsLoading(true)

      const group = getCertainGroupByNft(selectedNft)

      const { transaction, nftSigner } = await buildMintTransaction({
        umi,
        group,
        candyMachineAddress: CANDY_MACHINE_PUBKEY,
        selectedNftMint: selectedNft?.mint,
      })

      const { result, signature } = await transaction.sendAndConfirm(umi, {
        confirm: { commitment: 'finalized' },
        send: {
          skipPreflight: true,
        },
      })

      if (result.value.err !== null) {
        console.log('TRANSACTION RESULT: ', result)
        return false
      }

      const encodedSignature = encodeSignature(signature)
      const BANXMint = base58PublicKey(nftSigner?.publicKey?.bytes)

      const metadata = await getMetadataByCertainNft({
        nftMint: selectedNft?.mint,
        connection,
      })

      if (!metadata?.mint) {
        return false
      }

      // const response = await mintNftsQuery([
      //   {
      //     metadata,
      //     mint: BANXMint,
      //     baseNftMint: selectedNft?.mint,
      //     user: wallet?.publicKey?.toBase58(),
      //     txId: encodedSignature,
      //   },
      // ])

      setMintedNft(metadata)
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
    loadingModalVisible,
  }
}
