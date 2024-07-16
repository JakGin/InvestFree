export type BasicWallet = {
  account?: number
  wallet?: number
}

export type Wallet = {
  account: number
  wallet: number
  stocks: {
    stockTicker: string
    StockBoughtPrice: number
    units: number
    buyDate: string
    benefit: number
    benefitPercentage: number
  }[]
}

export type User = {
  username: string
  email: string
}
