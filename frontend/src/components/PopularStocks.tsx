import React, { useState } from "react"
import { Stock } from "./Stock"
import { SimpleGrid, Text } from "@chakra-ui/react"
import { fetcher } from "@/utils/fetcher"
import useSWR from "swr"
import { StocksDataT } from "@/types"
import { Pagination } from "./Pagination"

const PopularStocks = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsOnPage = 6
  const { data, error, isLoading } = useSWR<StocksDataT[]>(
    "/get_stocks_data",
    fetcher
  )

  function handlePageChange(page: number) {
    setCurrentPage(page)
  }

  if (isLoading) return <div>Loading...</div>

  if (!data) return <div>Error loading data</div>

  return (
    <div className="w-full">
      <Text
        className="text-3xl font-bold py-8 text-center"
        bgGradient="linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(88,196,96,1) 29%, rgba(0,246,255,1) 100%);"
        bgClip="text"
      >
        Popular Stocks
      </Text>
      <SimpleGrid
        spacing={4}
        templateColumns="repeat(auto-fill, minmax(320px, 1fr))"
        className="max-w-7xl mx-auto"
      >
        {data
          .slice((currentPage - 1) * 6, currentPage * 6)
          .map((stock, index) => (
            <Stock
              key={index}
              stockName={stock.stockName}
              stockSymbol={stock.stockSymbol}
              price={stock.lastClosePrice}
              priceChange={stock.lastPriceChange}
              percentChange={stock.lastPriceChangePercentage}
            />
          ))}
      </SimpleGrid>
      <div className="flex justify-center py-8">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(data.length / itemsOnPage)}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  )
}

export default PopularStocks
