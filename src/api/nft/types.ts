export interface NFT {
  mint: string
  name: string
  collectionName: string
  imageUrl: string

  valuation: number // lamports
  freezable: boolean
  stakingAvailable: boolean
  maxLoanValue: number // Max borrow value that user can get across all loan type

  classicParams?: {
    isLimitExceeded: boolean
    maxLoanValue: number // lamports
    timeBased: {
      liquidityPoolPubkey: string
      returnPeriodDays: number // 14 (days)
      ltvPercent: number // 40 (%)
      fee: number // lamports
      feeDiscountPercent: number // 2 (%)

      loanValue: number // lamports
      repayValue: number // lamports
    }
    priceBased?: {
      liquidityPoolPubkey: string
      ltvPercent: number // 40 (%)
      borrowAPRPercent: number // 10 (%)
      collaterizationRate: number // 10(%)
    }
  }

  bondParams?: {
    duration: number
    fee: number
    marketPubkey: string
    whitelistEntry: {
      publicKey: string
      fraktMarket: string
      whitelistedAddress: string
    }
    fraktMarket: string
    oracleFloor: string
    durations: Array<number> //? days
  }
}
