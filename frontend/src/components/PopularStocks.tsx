import React from "react"
import Stock from "./Stock"
import { SimpleGrid } from "@chakra-ui/react"

const stocks = [
  {
    stockName: "Apple Inc.",
    stockTicker: "AAPL",
    stockPrice: 145.86,
    stockChange: 0.86,
    stockPercentage: 0.59,
  },
  {
    stockName: "Apple Inc.",
    stockTicker: "AAPL",
    stockPrice: 145.86,
    stockChange: -0.86,
    stockPercentage: -0.59,
  },
  {
    stockName: "Apple Inc.",
    stockTicker: "AAPL",
    stockPrice: 145.86,
    stockChange: 0.86,
    stockPercentage: 0.59,
  },
  {
    stockName: "Apple Inc.",
    stockTicker: "AAPL",
    stockPrice: 145.86,
    stockChange: 0.86,
    stockPercentage: 0.59,
  },
]

const PopularStocks = () => {
  return (
    <div className="w-full">
      <h1 className="text-2xl font-medium py-4 text-center">Popular Stocks</h1>
      <SimpleGrid
        spacing={4}
        templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
        className="max-w-7xl mx-auto"
      >
        {stocks.map((stock, index) => (
          <Stock
            key={index}
            stockName={stock.stockName}
            stockTicker={stock.stockTicker}
            stockPrice={stock.stockPrice}
            stockChange={stock.stockChange}
            stockPercentage={stock.stockPercentage}
          />
        ))}
      </SimpleGrid>
    </div>
  )
}

export default PopularStocks
