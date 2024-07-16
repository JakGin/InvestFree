export type Wallet = {
  stocks: {
    stockSymbol: string
    stockName: string
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
  moneyInAccount: number
  moneyInStocks: number
  wallet: Wallet
}
