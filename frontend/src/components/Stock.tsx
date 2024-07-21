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
  FormHelperText,
  useDisclosure,
} from "@chakra-ui/react"
import { formattedPercent, formattedCurrency } from "@/utils/currency"
import { StockT } from "@/types"
import { getCSRFToken } from "@/utils/tokens"
import { mutate } from "swr"
import { SellStock } from "./SellStock"

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
        <div className="text-center font-medium text-xl">
          Price for unit
          <div className="text-lg font-medium">{formattedCurrency(price)}</div>
        </div>
        <div className="flex flex-col items-center text-xl font-medium">
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
        </div>
      </CardBody>
      <CardFooter>
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
  const { isOpen, onOpen, onClose } = useDisclosure()

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
            unitPrice: stock.lastClosePrice,
          }),
          credentials: "include",
        }
      )

      if (response.ok) {
        console.log("Stock sold successfully")
        onOpen()
        mutate("/user")
      } else {
        const error = await response.json()
        console.error("Failed to sell stock", error)
      }
    } catch (error) {
      console.error("Failed to sell stock", error)
    }

    setIsSelling(false)
  }

  return (
    <Card
      direction={{ base: "column", sm: "row" }}
      className="flex items-center"
    >
      <SellStock
        isOpen={isOpen}
        onClose={onClose}
        stockSymbol={stock.stockSymbol}
        quantity={unitsToSell}
        setUnitsToSell={setUnitsToSell}
      />
      <CardBody>
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
          className="inline-block"
        >
          <Text className="underline opacity-50 text-sm pt-2">
            Check on Yahoo Finance
          </Text>
        </Link>
      </CardBody>
      <CardFooter>
        <div className="flex flex-col md:flex-row gap-2 md:gap-12 md:items-center">
          <div>
            <Text>
              Shares: <span>{stock.quantity}</span>
            </Text>
            <Text>
              Profit:{" "}
              <span
                className={
                  stock.profit >= 0 ? "text-green-500" : "text-red-500"
                }
              >
                {formattedCurrency(stock.profit)}
              </span>
            </Text>
          </div>
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
              isDisabled={isSelling || unitsToSell === 0 ? true : false}
            >
              SELL
            </Button>
          </form>
        </div>
      </CardFooter>
    </Card>
  )
}
