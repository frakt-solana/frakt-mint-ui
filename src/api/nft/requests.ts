import { useQuery } from '@tanstack/react-query'
import { web3 } from '@project-serum/anchor'
import axios from 'axios'

import { NFT } from './types'

const BACKEND_DOMAIN = process.env.BACKEND_DOMAIN

type FetchWalletBorrowNfts = (props: {
  publicKey: web3.PublicKey
  limit?: number
  offset?: number
}) => Promise<NFT[]>

export const fetchWalletBorrowNfts: FetchWalletBorrowNfts = async ({
  publicKey,
  limit = 1000,
  offset = 0,
}) => {
  const { data } = await axios.get<NFT[]>(
    `https://${BACKEND_DOMAIN}/nft/meta2/${publicKey?.toBase58()}?limit=${limit}&skip=${offset}`,
  )

  return data
}

interface MintNftsQueryParams {
  metadata: any
  mint: string
  baseNftMint: string
  user: string
  txId: string
}

type MintNftsQuery = (params: MintNftsQueryParams[]) => Promise<any>

export const mintNftsQuery: MintNftsQuery = async (params) => {
  const { data } = await axios.post<NFT[]>(
    `https://${BACKEND_DOMAIN}/banx/reveal`,
    {
      nfts: params,
    },
  )

  return data
}

interface MintPresaleQueryParams {
  mint: string
  user: string
  txId: string
}

type MintPresaleNftsQuery = (params: MintPresaleQueryParams[]) => Promise<any>
export const mintPresaleNftsQuery: MintPresaleNftsQuery = async (params) => {
  const { data } = await axios.post<NFT[]>(
    `https://${BACKEND_DOMAIN}/banx/mint`,
    {
      nfts: params,
    },
  )

  return data
}

export const fetchTotalMintet = async () => {
  const { data } = await axios.get(
    `https://${BACKEND_DOMAIN}/banx/public-mint-count`,
  )

  return data
}

export const useFetchTotalMinted = () => {
  const {
    data,
    isLoading,
    isFetching,
  }: {
    data: any
    isLoading: boolean
    isFetching: boolean
  } = useQuery(['fetchTotalMintet'], () => fetchTotalMintet(), {
    staleTime: 60_000,
    refetchInterval: 5000,
    refetchOnWindowFocus: false,
  })

  return { data, loading: isLoading || isFetching }
}
