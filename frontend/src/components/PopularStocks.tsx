import React, { useState } from "react"
import { Stock } from "./Stock"
import { SimpleGrid } from "@chakra-ui/react"
import { fetcher } from "@/utils/fetcher"
import useSWR from "swr"
import { StocksData } from "@/types"
import { Pagination } from "./Pagination"

const PopularStocks = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsOnPage = 6
  const { data, error, isLoading } = useSWR<StocksData[]>(
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
      <h1 className="text-2xl font-medium py-4 text-center">Popular Stocks</h1>
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
              stockName={stock.name}
              stockSymbol={stock.T}
              price={stock.c}
              priceChange={stock.todayPriceChange}
              percentChange={stock.todayPriceChangePercentage}
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
