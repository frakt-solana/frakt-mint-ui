import { useEffect, useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'

import { NFTMetadata, getNFTsByOwner } from '@frakt/utils/nfts'

type UseFetchUserWhitelistTokens = () => {
  whitelistTokens: NFTMetadata[]
  whitelistTokensAmount: number
}

export const useFetchUserWhitelistTokens: UseFetchUserWhitelistTokens = () => {
  const [whitelistTokens, setWhitelistTokens] = useState<NFTMetadata[]>([])
  const { publicKey } = useWallet()
  const { connection } = useConnection()

  useEffect(() => {
    ;(async () => {
      if (!!publicKey) {
        const allUserNfts = await getNFTsByOwner(publicKey, connection)
        const whitelistTokens = allUserNfts.filter(() =>
          //TODO Add whitelistTokens filter
          console.log('whitelistTokens filter'),
        )
        setWhitelistTokens(whitelistTokens)
      }
    })()
  }, [publicKey])

  return { whitelistTokens, whitelistTokensAmount: whitelistTokens.length || 0 }
}
