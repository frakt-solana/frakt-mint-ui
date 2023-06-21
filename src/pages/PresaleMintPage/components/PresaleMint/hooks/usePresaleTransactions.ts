import { useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'

import { useLoadingModal } from '@frakt/components/LoadingModal'
import { encodeSignature, throwLogsError } from '@frakt/utils'
import { base58PublicKey } from '@metaplex-foundation/umi'
import { useUmi } from '@frakt/helpers/umi'
import {
  buildPublicMintTransaction,
  makeWhitelistMintTransaction,
} from '@frakt/utils/transactions/makeWhitelistMintTransaction'
import {
  MintedNft,
  parseNft,
} from '@frakt/pages/RootPage/views/LiveMint/components/MintForNFTs/helpers'
import { mintPresaleNftsQuery } from '@frakt/api/nft'

export const usePresaleTransactions = (
  inputValue: string,
  whitelistTokenAmount: number,
  refetchWhitelistTokens: () => void,
  resetInputValue: () => void,
) => {
  const umi = useUmi()
  const { connection } = useConnection()
  const wallet = useWallet()

  const [mintedNft, setMintedNft] = useState<MintedNft>(null)

  const {
    visible: loadingModalVisible,
    open: openLoadingModal,
    close: closeLoadingModal,
  } = useLoadingModal()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isStartAnimation, setIsStartAnimation] = useState<boolean>(false)
  const [startTxnOneByOne, setStartTxnOneByOne] = useState(false)

  const onSingleMint = async () => {
    try {
      if (!!whitelistTokenAmount) {
        setIsLoading(true)

        const { transaction, nftSigner } = await buildPublicMintTransaction({
          umi,
        })

        const { signature, result } = await transaction.sendAndConfirm(umi, {
          confirm: { commitment: 'finalized' },
        })

        const encodedSignature = encodeSignature(signature)

        if (result.value.err !== null) {
          return false
        }

        const [response] = await mintPresaleNftsQuery([
          {
            mint: base58PublicKey(nftSigner?.publicKey?.bytes),
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
        setIsStartAnimation(true)
        refetchWhitelistTokens()
      }
    } catch (error) {
      throwLogsError(error)
      setIsLoading(false)
      setStartTxnOneByOne(false)
    } finally {
      setIsLoading(false)
      setStartTxnOneByOne(false)
    }
  }

  const onBulkMint = async () => {
    openLoadingModal()
    try {
      const mintsTransactionsParams = []

      for (let i = 0; i < parseFloat(inputValue); i++) {
        try {
          const { transactionMint, nftSigner } =
            await makeWhitelistMintTransaction({
              umi,
            })

          mintsTransactionsParams.push({
            mint: base58PublicKey(nftSigner?.publicKey?.bytes),
            transaction: transactionMint,
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

      const response = await mintPresaleNftsQuery(
        mintsTransactionsParamsWithTxids,
      )

      console.log(response, 'response')
      resetInputValue()
      refetchWhitelistTokens()
    } catch (error) {
      console.log(error)
    } finally {
      closeLoadingModal()
    }
  }

  const handleResetAnimation = () => {
    setIsStartAnimation(false)
    setIsLoading(false)
    setStartTxnOneByOne(true)
  }

  return {
    mintedNft,
    startTxnOneByOne,

    onSingleMint,
    onBulkMint,
    handleResetAnimation,
    openLoadingModal,

    isLoading,
    isStartAnimation,
    loadingModalVisible,
  }
}
