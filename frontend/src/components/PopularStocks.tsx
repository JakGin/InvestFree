import React from "react"
import { Stock } from "./Stock"
import { SimpleGrid } from "@chakra-ui/react"
import { fetcher } from "@/utils/fetcher"
import useSWR from "swr"
import { StocksData } from "@/types"

const PopularStocks = () => {
  const { data, error, isLoading } = useSWR<StocksData[]>(
    "/get_stocks_data",
    fetcher
  )

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="w-full">
      <h1 className="text-2xl font-medium py-4 text-center">Popular Stocks</h1>
      <SimpleGrid
        spacing={4}
        templateColumns="repeat(auto-fill, minmax(250px, 1fr))"
        className="max-w-7xl mx-auto"
      >
        {data?.slice(0, 6).map((stock, index) => (
          <Stock
            key={index}
            stockName={stock.name}
            stockSymbol={stock.T}
            price={stock.c}
            priceChange={stock.todayPriceChange}
            percentChange={stock.todayPriceChangePercentage}
          />
        ))}
      </SimpleGrid>
    </div>
  )
}

export default PopularStocks
