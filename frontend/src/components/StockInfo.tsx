import { formattedCurrency, formattedPercent } from "@/utils/currency"
import React from "react"

const StockInfo = ({
  stockName,
  stockSymbol,
  price,
  priceChange,
  percentChange,
}: {
  stockName: string
  stockSymbol: string
  price: number
  priceChange: number
  percentChange: number
}) => {
  return (
    <section>
      <h1 className="text-2xl font-medium py-2">Stock Information</h1>
      <div>
        <div>Stock Name: {stockName}</div>
        <div>Stock Symbol: {stockSymbol}</div>
        <div>Price for 1 unit: {formattedCurrency(price)}</div>
        <div>Price Change: {formattedCurrency(priceChange)}</div>
        <div>Percetage Change: {formattedPercent(percentChange)}</div>
      </div>
    </section>
  )
}

export default StockInfo
