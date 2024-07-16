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
  user: {
    username: string
    email: string
  }
  wallet: Wallet
}
