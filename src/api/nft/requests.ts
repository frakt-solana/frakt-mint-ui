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
