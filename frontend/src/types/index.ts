export type StockT = {
  stockSymbol: string
  stockName: string
  quantity: number
}

export type UserT = {
  username: string
  email: string
  moneyInAccount: number
  moneyInStocks: number
  stocksOwned: StockT[]
}

export type StocksDataT = {
  stockSymbol: string
  stockName: string
  lastClosePrice: number
  lastPriceChange: number
  lastPriceChangePercentage: number
}
