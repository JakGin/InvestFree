export type StocksDataT = {
  stockSymbol: string
  stockName: string
  lastClosePrice: number
  lastPriceChange: number
  lastPriceChangePercentage: number
}

export type StockT = StocksDataT & {
  quantity: number
  profit: number
}

export type UserT = {
  username: string
  email: string
  moneyInAccount: number
  moneyInStocks: number
  stocksOwned: StockT[]
}

export type BestInvestorT = {
  placement: number
  username: string
  dateJoined: string
  numberOfStocks: number
  total: number
}
