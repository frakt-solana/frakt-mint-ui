import { useEffect, useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { web3 } from '@project-serum/anchor'

export const useNativeAccount = (): {
  account: web3.AccountInfo<Buffer>
} => {
  const { connection } = useConnection()
  const { wallet, publicKey } = useWallet()

  const [nativeAccount, setNativeAccount] = useState<web3.AccountInfo<Buffer>>()

  useEffect(() => {
    if (!connection || !publicKey) {
      return
    }

    connection.getAccountInfo(publicKey).then((acc) => {
      if (acc) {
        setNativeAccount(acc)
      }
    })
    connection.onAccountChange(publicKey, (acc) => {
      if (acc) {
        setNativeAccount(acc)
      }
    })
  }, [wallet, publicKey, connection])

  return { account: nativeAccount }
}
