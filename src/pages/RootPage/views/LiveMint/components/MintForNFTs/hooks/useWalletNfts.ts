import { useEffect, useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useQuery } from '@tanstack/react-query'

import { fetchWalletBorrowNfts } from '@frakt/api/nft'
import { getNFTsByOwner } from '@frakt/utils/nfts'

const FETCH_LIMIT = 1000

const creators = [
  'EEgrfJLLdEo8GdP25BCLAaEAofcGq7Bq1Qpb9ZrXizGm',
  '6wPYbuGRXZjVw2tCeTxwRiQU7AzFDTeFEKuUFpJZpcix',
]

export const useWalletNfts = () => {
  const wallet = useWallet()

  const { data, isLoading } = useQuery(
    ['walletNfts', wallet?.publicKey?.toBase58()],
    () =>
      fetchWalletBorrowNfts({
        publicKey: wallet.publicKey,
        limit: FETCH_LIMIT,
      }),
    {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      enabled: wallet.connected,
    },
  )

  return {
    nfts:
      data?.filter((nft) =>
        creators.includes(nft?.bondParams?.whitelistEntry?.whitelistedAddress),
      ) || [],
    isLoading,
  }
}

export const useDevnetWalletNfts = () => {
  const { publicKey } = useWallet()
  const { connection } = useConnection()

  const [devnetNfts, setDevnetNfts] = useState<any[]>([])

  useEffect(() => {
    ;(async () => {
      if (connection && publicKey) {
        const data = await getNFTsByOwner(publicKey, connection)
        setDevnetNfts(data)
      }
    })()
  }, [connection, publicKey])

  const nfts = parseDevnetNfts(devnetNfts)

  return {
    nfts: nfts || [],
  }
}

const parseDevnetNfts = (devnetNfts) => {
  return devnetNfts.map((nft) => {
    return {
      mint: nft?.mint,
      name: nft?.externalMetadata?.name,
      imageUrl: nft?.externalMetadata?.image,
    }
  })
}
