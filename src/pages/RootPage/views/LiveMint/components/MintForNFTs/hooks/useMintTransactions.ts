import {
  MintedNft,
  getCertainGroupByNft,
  getMetadataByCertainNft,
  parseNft,
} from '../helpers'
import { mintNftsQuery } from '@frakt/api/nft'
import { useLoadingModal } from '@frakt/components/LoadingModal'
import { CANDY_MACHINE_PUBKEY } from '@frakt/constants'
import { useUmi } from '@frakt/helpers/umi'
import { throwLogsError } from '@frakt/utils'
import {
  buildMintTransaction,
  makeMintTransaction,
} from '@frakt/utils/transactions/makeMintTransaction'
import { base58PublicKey } from '@metaplex-foundation/umi'
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useEffect, useState } from 'react'

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

  const [mintedNft, setMintedNft] = useState<MintedNft>(null)

  const selectedNft = selection[0]

  const [startTxnOneByOne, setStartTxnOneByOne] = useState(false)

  const handleResetAnimation = () => {
    setIsStartAnimation(false)
    setIsLoading(false)
    clearSelection()
    setStartTxnOneByOne(true)
  }

  useEffect(() => {
    if (startTxnOneByOne && !!selectedNft?.mint) {
      onSingleMint()
    }
  }, [startTxnOneByOne, selectedNft])

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
            nftMint: nft?.mint,
            connection,
          })

          if (!metadata?.mint) {
            return false
          }

          mintsTransactionsParams.push({
            metadata: JSON.stringify(metadata?.externalMetadata),
            transaction: transactionMint,
            mint: base58PublicKey(nftSigner?.publicKey?.bytes),
            baseNftMint: nft?.mint,
            user: wallet?.publicKey?.toBase58(),
          })
        } catch (error) {
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

      await new Promise((r) => setTimeout(r, 8000))

      const mintsTransactionsParamsWithTxids = mintsTransactionsParams.map(
        (mintTransaction, id) => {
          return {
            ...mintTransaction,
            txId: txids[id],
          }
        },
      )

      const response = await mintNftsQuery(mintsTransactionsParamsWithTxids)
      console.log(response)

      hideNFT(mintsTransactionsParams?.map(({ baseNftMint }) => baseNftMint))
      console.log(response, 'response')
    } catch (error) {
      console.log(error)
    } finally {
      clearSelection()
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

      const metadata = await getMetadataByCertainNft({
        nftMint: selectedNft?.mint,
        connection,
      })

      if (!metadata?.mint) {
        return false
      }

      const [response] = await mintNftsQuery([
        {
          metadata: JSON.stringify(metadata?.externalMetadata),
          mint: base58PublicKey(nftSigner?.publicKey?.bytes),
          baseNftMint: selectedNft?.mint,
          user: wallet?.publicKey?.toBase58(),
          txId: encodedSignature,
        },
      ])

      console.log(response?.success, 'success')

      console.log('New metadata: ', response?.metadata)

      if (!response?.success) {
        return false
      }

      const parsedNewMetadata = parseNft(response?.metadata)

      setMintedNft(parsedNewMetadata)
      hideNFT([selectedNft?.mint])
      setIsStartAnimation(true)
    } catch (error) {
      throwLogsError(error)
      setIsLoading(false)
      setStartTxnOneByOne(false)
    } finally {
      setIsLoading(false)
      setStartTxnOneByOne(false)
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
    startTxnOneByOne,
  }
}
