import { fetchWalletBorrowNfts } from '@frakt/api/nft'
import { creators } from '@frakt/constants'
import { getNFTsByOwner } from '@frakt/utils/nfts'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useQuery } from '@tanstack/react-query'
import { produce } from 'immer'
import { useEffect, useState } from 'react'
import { create } from 'zustand'

const FETCH_LIMIT = 1000

export const useWalletNfts = () => {
  const { hiddenNFTsMint, hideNFT } = useHiddenNFTsMint()

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

  const nfts = data?.filter(({ mint }) => !hiddenNFTsMint.includes(mint)) || []

  return {
    nfts:
      nfts?.filter((nft) =>
        creators.includes(nft?.bondParams?.whitelistEntry?.whitelistedAddress),
      ) || [],
    isLoading,
    hideNFT,
  }
}

interface HiddenNFTsPubkeysState {
  hiddenNFTsMint: string[]
  hideNFT: (nft: string[]) => void
}
const useHiddenNFTsMint = create<HiddenNFTsPubkeysState>((set) => ({
  hiddenNFTsMint: [],
  hideNFT: (nftMint: string[]) =>
    set(
      produce((state: HiddenNFTsPubkeysState) => {
        state.hiddenNFTsMint = [...state.hiddenNFTsMint, ...nftMint]
      }),
    ),
}))

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
