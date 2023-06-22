import {
  Market,
  Pair,
  fetchCertainMarket,
  fetchMarketPairs,
} from '@frakt/api/bonds'
import { web3 } from 'fbonds-core'
import { BOND_DECIMAL_DELTA } from 'fbonds-core/lib/fbond-protocol/constants'
import {
  BondCartOrder,
  BondOfferV2,
} from 'fbonds-core/lib/fbond-protocol/types'
import {
  Order,
  getBestOrdersByBorrowValue,
} from 'fbonds-core/lib/fbond-protocol/utils/cartManagerV2'

const BASE_POINTS = 1e4
const BONDS_PROTOCOL_FEE_IN_BASE_POINTS = 50

export const fetchMarketAndPairs = async (
  marketPubkey: string,
  walletPubkey: web3.PublicKey,
) => {
  const marketWeb3Pubkey = new web3.PublicKey(marketPubkey)
  const [pairs, market] = await Promise.all([
    await fetchMarketPairs({ marketPubkey: marketWeb3Pubkey }),
    await fetchCertainMarket({ marketPubkey: marketWeb3Pubkey }),
  ])

  const filteredPairs = filterPairs(pairs, walletPubkey)

  return { pairs: filteredPairs, market }
}

export const getBondOrderParams = ({
  market,
  pairs,
  maxLoanValue,
}: {
  market: Market
  pairs: BondOfferV2[]
  maxLoanValue: number
}) => {
  const { takenOrders } = getBestOrdersByBorrowValue({
    borrowValue: maxLoanValue,
    collectionFloor: market?.oracleFloor?.floor,
    bondOffers: pairs.filter((pair) => pairLoanDurationFilter({ pair })),
  })

  const bondOrderParams = {
    market,
    orderParams: takenOrders.map((order) => {
      const affectedPair = pairs.find(
        (pair) => pair.publicKey === order.pairPubkey,
      )

      return convertTakenOrderToOrderParams({
        pair: affectedPair,
        takenOrder: order,
      })
    }),
  }

  return bondOrderParams
}

const filterPairs = (pairs: BondOfferV2[], walletPubkey: web3.PublicKey) => {
  return pairs
    .filter(({ currentSpotPrice }) => currentSpotPrice <= BOND_DECIMAL_DELTA)
    .map(patchPairWithProtocolFee)
    .filter(({ assetReceiver }) => assetReceiver !== walletPubkey?.toBase58())
}

type PatchPairWithProtocolFee = (pair: Pair) => Pair
export const patchPairWithProtocolFee: PatchPairWithProtocolFee = (pair) => {
  return {
    ...pair,
    currentSpotPrice:
      pair.currentSpotPrice -
      (pair.currentSpotPrice * BONDS_PROTOCOL_FEE_IN_BASE_POINTS) / BASE_POINTS,
    baseSpotPrice:
      pair.baseSpotPrice -
      (pair.baseSpotPrice * BONDS_PROTOCOL_FEE_IN_BASE_POINTS) / BASE_POINTS,
  }
}

type ConvertTakenOrderToOrderParams = (params: {
  pair: Pair
  takenOrder: Order
}) => BondCartOrder
export const convertTakenOrderToOrderParams: ConvertTakenOrderToOrderParams = ({
  pair,
  takenOrder,
}) => ({
  orderSize: takenOrder.orderSize,
  spotPrice: takenOrder.pricePerShare,
  pairPubkey: takenOrder.pairPubkey,
  assetReceiver: pair.assetReceiver,
  durationFilter: pair.validation.durationFilter,
  bondFeature: pair.validation.bondFeatures,
})

type PairLoanDurationFilter = (props: {
  pair: Pair
  duration?: number
}) => boolean
export const pairLoanDurationFilter: PairLoanDurationFilter = ({
  pair,
  duration = 7, //? Days
}) => duration * (24 * 60 * 60) <= pair?.validation?.durationFilter
