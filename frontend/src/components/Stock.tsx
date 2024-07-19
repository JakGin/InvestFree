import React from "react"
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Text,
  Button,
  Link,
  StatArrow,
  Stat,
} from "@chakra-ui/react"
import { formattedPercent, formattedCurrency } from "@/utils/currency"
import { StockT } from "@/types"
import { getCSRFToken } from "@/utils/tokens"
import { mutate } from "swr"

export function Stock({
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
}) {
  return (
    <Card>
      <CardHeader>
        <Heading size="md" className="text-center">
          {stockSymbol}, {stockName}
        </Heading>
      </CardHeader>
      <CardBody className="flex flex-col gap-4 justify-between">
        <Text className="text-center font-medium text-xl">
          Price for unit
          <div className="text-lg font-medium">{formattedCurrency(price)}</div>
        </Text>
        <Text className="flex flex-col items-center text-xl font-medium">
          Last day change
          <div className="text-lg font-medium flex items-center gap-1">
            <Stat>
              <StatArrow type={priceChange > 0 ? "increase" : "decrease"} />
            </Stat>
            <Text>
              {formattedCurrency(priceChange)} (
              {formattedPercent(percentChange)})
            </Text>
          </div>
        </Text>
      </CardBody>
      <CardFooter className="flex self-center">
        <Link
          href={`https://finance.yahoo.com/quote/${stockSymbol}/`}
          isExternal
        >
          <Text className="underline opacity-50">Check on Yahoo Finance</Text>
        </Link>
      </CardFooter>
    </Card>
  )
}

export function StockInWallet({ stock }: { stock: StockT }) {
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
            quantity: Number(stock.quantity),
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
        <h1>{stock.stockName} ({stock.stockSymbol})</h1>
      </CardHeader>
      <CardBody>
        <p>Shares: {stock.quantity}</p>
      </CardBody>
      <CardFooter>
        <form onSubmit={handleSell}>
          <Button type="submit" colorScheme="red">
            SELL
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
