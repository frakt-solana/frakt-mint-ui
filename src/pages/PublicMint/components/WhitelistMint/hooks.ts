import { MintedNft } from './../../../RootPage/views/LiveMint/components/MintForNFTs/helpers'
import { base58PublicKey } from '@metaplex-foundation/umi'
import { useEffect, useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { encodeSignature, throwLogsError } from '@frakt/utils'

import { useLoadingModal } from '@frakt/components/LoadingModal'
import { WL_TOKEN_MINT } from '@frakt/constants'
import { useTokenBalance } from '@frakt/hooks'
import { useUmi } from '@frakt/helpers/umi'
import {
  buildPublicMintTransaction,
  makeWhitelistMintTransaction,
} from '@frakt/utils/transactions/makeWhitelistMintTransaction'
import { parseNft } from '@frakt/pages/RootPage/views/LiveMint/components/MintForNFTs/helpers'

export const useWhitelistMint = () => {
  const { connection } = useConnection()

  const [whitelistTokenAmount, refetchWhitelistTokens] = useTokenBalance(
    WL_TOKEN_MINT,
    connection,
  )

  const [isBulkMint, setIsBulkMint] = useState<boolean>(false)
  const [inputValue, setInputValue] = useState<string>('0')

  useEffect(() => {
    if (whitelistTokenAmount) {
      setInputValue('1')
    }
  }, [whitelistTokenAmount])

  const onChangeInputValue = (value: string) => {
    if (whitelistTokenAmount < parseFloat(value)) {
      setInputValue(String(whitelistTokenAmount))
    } else {
      setInputValue(value)
    }
  }

  const handleToggleBulkMint = () => {
    setIsBulkMint(!isBulkMint)
  }

  const {
    onSingleMint,
    onBulkMint,
    isLoading,
    isStartAnimation,
    loadingModalVisible,
    handleResetAnimation,
    mintedNft,
  } = useWhitelistTransactions(inputValue, refetchWhitelistTokens)

  const showReveal = isStartAnimation || isLoading

  return {
    mintedNft,
    whitelistTokenAmount,
    inputValue,

    onSubmit: isBulkMint ? onBulkMint : onSingleMint,
    handleResetAnimation,
    handleToggleBulkMint,
    onChangeInputValue,

    showReveal,
    isLoading,
    isBulkMint,
    loadingModalVisible,
  }
}

export const useWhitelistTransactions = (
  inputValue: string,
  refetchWhitelistTokens: () => void,
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

  const onSingleMint = async () => {
    try {
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

      // const [response] = await mintNftsQuery([
      //   {
      //     mint: base58PublicKey(nftSigner?.publicKey?.bytes),
      //     user: wallet?.publicKey?.toBase58(),
      //     txId: encodedSignature,
      //   },
      // ])

      // console.log(response?.success, 'success')

      // console.log('New metadata: ', response?.metadata)

      // if (!response?.success) {
      //   return false
      // }

      // const parsedNewMetadata = parseNft(response?.metadata)

      // setMintedNft(parsedNewMetadata)
      setIsStartAnimation(true)
      refetchWhitelistTokens()
    } catch (error) {
      console.log(error)
      throwLogsError(error)
    } finally {
      setIsLoading(false)
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
            token: WL_TOKEN_MINT,
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

      // const response = await mintNftsQuery(mintsTransactionsParamsWithTxids)

      // console.log(response, 'response')
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
  }

  return {
    mintedNft,

    onSingleMint,
    onBulkMint,
    handleResetAnimation,

    isLoading,
    isStartAnimation,
    loadingModalVisible,
  }
}
