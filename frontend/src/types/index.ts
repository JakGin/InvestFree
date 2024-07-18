export type Stock = {
  stockSymbol: string
  stockName: string
  StockBoughtPrice: number
  units: number
  buyDate: string
  benefit: number
  benefitPercentage: number
}

export type Wallet = {
  stocks: Stock[]
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

export type StocksData = {
    name: string
    T: string
    c: number
    h: number
    l: number
    n: number
    o: number
    t: string
    v: number
    vw: number
}
