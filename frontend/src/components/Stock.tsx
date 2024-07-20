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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  FormControl,
  FormLabel,
  FormHelperText,
} from "@chakra-ui/react"
import { formattedPercent, formattedCurrency } from "@/utils/currency"
import { StocksDataT, StockT } from "@/types"
import { getCSRFToken } from "@/utils/tokens"
import useSWR, { mutate } from "swr"
import { fetcher } from "@/utils/fetcher"
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react"

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
  const [unitsToSell, setUnitsToSell] = React.useState(0)
  const [isSelling, setIsSelling] = React.useState(false)

  async function handleSell(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSelling(true)
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
            quantity: unitsToSell,
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

    setIsSelling(false)
    setUnitsToSell(0)
  }

  return (
    <Card
      direction={{ base: "column", sm: "row" }}
      className="flex items-center"
    >
      <CardHeader>
        <h1 className="font-semibold text-lg">
          {stock.stockName} ({stock.stockSymbol})
        </h1>
        <Stat>
          <div className="flex items-center gap-1">
            <StatArrow
              type={stock.lastPriceChange > 0 ? "increase" : "decrease"}
            />
            <Text>
              {formattedCurrency(stock.lastPriceChange)} (
              {formattedPercent(stock.lastPriceChangePercentage)})
            </Text>
          </div>
        </Stat>
        <Link
          href={`https://finance.yahoo.com/quote/${stock.stockSymbol}/`}
          isExternal
        >
          <Text className="underline opacity-50 text-sm pt-2">
            Check on Yahoo Finance
          </Text>
        </Link>
      </CardHeader>
      <CardBody></CardBody>
      <CardFooter className="flex flex-col lg:flex-row">
        <Text>Shares: {stock.quantity}</Text>
        <Text>Profit: {formattedCurrency(stock.profit)}</Text>
        <form onSubmit={handleSell} className="flex flex-col gap-2">
          <FormControl>
            <NumberInput
              size="md"
              maxW={32}
              max={stock.quantity}
              keepWithinRange={false}
              clampValueOnBlur={false}
              value={unitsToSell}
              onChange={(value) => setUnitsToSell(Number(value))}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <FormHelperText>Number of units to sell</FormHelperText>
          </FormControl>
          <Button
            type="submit"
            colorScheme="red"
            isDisabled={isSelling ? true : false}
          >
            SELL
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
