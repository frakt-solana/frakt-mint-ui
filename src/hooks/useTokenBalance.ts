import { useCallback, useEffect, useState } from 'react'

import { getAssociatedTokenAddress } from '@solana/spl-token-2'
import { useWallet } from '@solana/wallet-adapter-react'
import { Connection, PublicKey } from '@solana/web3.js'

export const useTokenBalance = (
  tokenAddress: string,
  connection: Connection,
): [number, () => void] => {
  const { publicKey: walletPublicKey } = useWallet()

  const [balance, setBalance] = useState<number>(0)

  const fetchBalance = useCallback(async () => {
    try {
      const tokenAccount = await getAssociatedTokenAddress(
        new PublicKey(tokenAddress),
        walletPublicKey,
        true,
      )

      const tokenBalance = await connection.getTokenAccountBalance(tokenAccount)
      setBalance(tokenBalance?.value?.uiAmount)
    } catch (e) {
      console.log(`error getting balance: `, e)
      setBalance(0)
    }
  }, [tokenAddress, walletPublicKey])

  useEffect(() => {
    if (tokenAddress && walletPublicKey) {
      fetchBalance()
    }
  }, [fetchBalance, tokenAddress, walletPublicKey])

  const refetchBalance = useCallback(() => {
    fetchBalance()
  }, [fetchBalance])

  return [balance, refetchBalance]
}
