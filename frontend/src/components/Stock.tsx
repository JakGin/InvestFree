import React from "react"
import { BiSolidDownArrow, BiSolidUpArrow } from "react-icons/bi"
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Text,
  Button,
} from "@chakra-ui/react"
import { formattedPercent } from "@/utils/currency"
import { Stock as StockT } from "@/types"
import { getCSRFToken } from "@/utils/tokens"
import { mutate } from "swr"

export default function Stock({
  stockName,
  stockTicker,
  stockPrice,
  stockChange,
  stockPercentage,
}: {
  stockName: string
  stockTicker: string
  stockPrice: number
  stockChange: number
  stockPercentage: number
}) {
  return (
    <Card>
      <CardHeader>
        <Heading size="md">
          {stockName} ({stockTicker})
        </Heading>
      </CardHeader>
      <CardBody>
        <Text className="flex gap-2 items-center">
          {stockChange > 0 ? (
            <BiSolidUpArrow color="green" />
          ) : (
            <BiSolidDownArrow color="red" />
          )}
          {stockChange} ({formattedPercent(stockPercentage)})
        </Text>
      </CardBody>
      {/* <CardFooter>
        <Link to="">
          <Text>See on Google</Text>
        </Link>
      </CardFooter> */}
    </Card>
  )
}

export function Stock2({ stock }: { stock: StockT }) {
  async function handleSell(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/stock/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken() || "",
          },
          body: JSON.stringify({
            stockSymbol: stock.stockSymbol,
            unitPrice: stock.StockBoughtPrice,
            quantity: Number(stock.units),
            buyDate: stock.buyDate,
          }),
          credentials: "include",
        }
      )

      if (response.ok) {
        console.log("Stock sold successfully")
        mutate("/user")
      } else {
        const error = await response.json()
        console.error("Failed to sell stock", error)
      }
    } catch (error) {
      console.error("Failed to sell stock", error)
    }
  }

  return (
    <Card
      direction={{ base: "column", sm: "row" }}
      className="flex items-center"
    >
      <CardHeader>
        <h1>{stock.stockName}</h1>
        <Text className="flex gap-2 items-center">
          {9.99 > 0 ? (
            <BiSolidUpArrow color="green" />
          ) : (
            <BiSolidDownArrow color="red" />
          )}
          {9.99} ({formattedPercent(9.99)})
        </Text>
      </CardHeader>
      <CardBody>
        <p>Current Price: $999.99</p>
        <p>Units: {stock.units}</p>
        <p>Buy date: {stock.buyDate}</p>
        <p>Stock Bought unit Price: {stock.StockBoughtPrice}</p>
        <p>Benefit: $99.99</p>
        <p>Benefit Percentage: 99%</p>
      </CardBody>
      <CardFooter>
        <form onSubmit={handleSell}>
          <Button type="submit" colorScheme="red">SELL</Button>
        </form>
      </CardFooter>
    </Card>
  )
}
