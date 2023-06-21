import { base58PublicKey } from '@metaplex-foundation/umi'
import { useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { encodeSignature, throwLogsError } from '@frakt/utils'

import { useUmi } from '@frakt/helpers/umi'
import { useTokenBalance } from '@frakt/hooks'
import {
  buildPublicMintTransaction,
  makeWhitelistMintTransaction,
} from '@frakt/utils/transactions/makeWhitelistMintTransaction'
import { WL_TOKEN_MINT } from '@frakt/constants'

export const useWhitelistMint = () => {
  const umi = useUmi()
  const { connection } = useConnection()
  const wallet = useWallet()

  const whitelistTokenAmount = useTokenBalance(WL_TOKEN_MINT, connection)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isStartAnimation, setIsStartAnimation] = useState<boolean>(false)

  const onSubmit = async () => {
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
      setIsStartAnimation(true)
    } catch (error) {
      console.log(error)
      throwLogsError(error)
    } finally {
      setIsLoading(false)
    }
  }

  const onBulkMint = async () => {
    // openLoadingModal()
    try {
      const mintsTransactionsParams = []

      for (let i = 0; i < whitelistTokenAmount; i++) {
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
    } catch (error) {
      console.log(error)
    } finally {
      // closeLoadingModal()
    }
  }

  const showReveal = isStartAnimation || isLoading

  const handleResetAnimation = () => {
    setIsStartAnimation(false)
    setIsLoading(false)
  }

  return {
    onSubmit,
    showReveal,
    isLoading,
    handleResetAnimation,
    whitelistTokenAmount,
  }
}
