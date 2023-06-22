import axios from 'axios'

import { Market, Pair } from './types'
import { web3 } from 'fbonds-core'

const BACKEND_DOMAIN = process.env.BACKEND_DOMAIN

type FetchCertainMarket = (props: {
  marketPubkey: web3.PublicKey
}) => Promise<Market>
export const fetchCertainMarket: FetchCertainMarket = async ({
  marketPubkey,
}) => {
  const { data } = await axios.get<Market>(
    `https://${BACKEND_DOMAIN}/markets/${marketPubkey?.toBase58()}`,
  )

  return data
}

type FetchMarketPairs = (props: {
  marketPubkey: web3.PublicKey
}) => Promise<Pair[]>
export const fetchMarketPairs: FetchMarketPairs = async ({ marketPubkey }) => {
  const { data } = await axios.get<Pair[]>(
    `https://${BACKEND_DOMAIN}/bond-offers/${marketPubkey?.toBase58()}`,
  )

  return data
  // .filter(
  //   ({ currentSpotPrice }) => currentSpotPrice <= BOND_DECIMAL_DELTA,
  // );
}

type FetchMarketPair = (props: { pairPubkey: web3.PublicKey }) => Promise<Pair>
export const fetchMarketPair: FetchMarketPair = async ({ pairPubkey }) => {
  const { data } = await axios.get<Pair>(
    `https://${BACKEND_DOMAIN}/bond-offer/${pairPubkey?.toBase58()}`,
  )

  return data
}
