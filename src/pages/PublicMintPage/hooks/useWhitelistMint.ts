import { useEffect, useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'

import { WL_TOKEN_MINT_1 } from '@frakt/constants'
import { useTokenBalance } from '@frakt/hooks'
import { useWhiteListTransactions } from './useWhiteListTransactions'

export const useWhitelistMint = () => {
  const { connection } = useConnection()
  const { connected } = useWallet()

  const [whitelistTokenAmount, refetchWhitelistTokens] = useTokenBalance(
    WL_TOKEN_MINT_1,
    connection,
  )

  const [isBulkMint, setIsBulkMint] = useState<boolean>(false)
  const [inputValue, setInputValue] = useState<string>('1')

  useEffect(() => {
    if (whitelistTokenAmount && !isBulkMint) {
      setInputValue('1')
    }
  }, [whitelistTokenAmount, inputValue, isBulkMint])

  const onChangeInputValue = (value: string) => {
    setInputValue(value)
  }

  const resetInputValue = () => {
    setInputValue('0')
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
    startTxnOneByOne,
  } = useWhiteListTransactions(
    inputValue,
    whitelistTokenAmount,
    refetchWhitelistTokens,
    resetInputValue,
  )

  useEffect(() => {
    if (startTxnOneByOne && !!whitelistTokenAmount) {
      onSingleMint()
    }
  }, [startTxnOneByOne, whitelistTokenAmount])

  const showReveal = isStartAnimation || isLoading
  const showConnectedState = connected && !showReveal && !startTxnOneByOne

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
    showConnectedState,
  }
}
