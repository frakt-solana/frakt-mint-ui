import { useQuery } from '@tanstack/react-query'
import { useWallet } from '@solana/wallet-adapter-react'

import { NFT, fetchWalletBorrowNfts } from '@frakt/api/nft'

export const useFetchWalletNFTs = () => {
  const { publicKey: walletPublicKey } = useWallet()

  const {
    data,
    isLoading,
    isFetching,
  }: {
    data: NFT[]
    isLoading: boolean
    isFetching: boolean
  } = useQuery(
    ['fetchWalletNFTs', walletPublicKey],
    () => fetchWalletBorrowNfts({ publicKey: walletPublicKey, limit: 500 }),
    {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  )

  const bondsNfts = data
    ?.filter((nft) => !!nft?.bondParams?.marketPubkey)
    ?.filter(({ valuation }) => valuation > 10 * 1e9)

  return { nfts: bondsNfts || [], loading: isLoading || isFetching }
}
