import { useInfiniteQuery } from '@tanstack/react-query'
import { useWallet } from '@solana/wallet-adapter-react'

import { fetchWalletBorrowNfts } from '@frakt/api/nft'

const FETCH_LIMIT = 15

export const useWalletNfts = () => {
  const wallet = useWallet()

  const fetchData = async ({ pageParam }: { pageParam: number }) => {
    const data = await fetchWalletBorrowNfts({
      publicKey: wallet.publicKey,
      limit: FETCH_LIMIT,
      offset: pageParam * FETCH_LIMIT,
    })

    return { pageParam, data }
  }

  const { data, hasNextPage, fetchNextPage, isLoading, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['walletNfts', wallet?.publicKey?.toBase58()],
      queryFn: ({ pageParam = 0 }) => fetchData({ pageParam }),
      getPreviousPageParam: (firstPage) => {
        return firstPage.pageParam - 1 ?? undefined
      },
      getNextPageParam: (lastPage) => {
        return lastPage.data?.length ? lastPage.pageParam + 1 : undefined
      },
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      enabled: wallet.connected,
    })

  return {
    nfts: data?.pages?.map((page) => page.data).flat() || [],
    initialLoading: isLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  }
}
