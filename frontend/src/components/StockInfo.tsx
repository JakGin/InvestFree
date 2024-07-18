import { formattedCurrency, formattedPercent } from "@/utils/currency"
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  Link,
  Text,
} from "@chakra-ui/react"
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
      <Card>
        <CardHeader>
          <Heading size="md">
            {stockSymbol}, {stockName}
          </Heading>
        </CardHeader>
        <CardBody>
          <Text>
            Price for unit:{" "}
            <span className="text-lg font-medium">
              {formattedCurrency(price)}
            </span>
          </Text>
          <Text>
            Today price change:{" "}
            <span className="text-lg font-medium">
              {formattedCurrency(priceChange)}
            </span>
          </Text>
          <Text>
            Today percetage change:{" "}
            <span className="text-lg font-medium">
              {formattedCurrency(percentChange)}
            </span>
          </Text>
        </CardBody>
        <CardFooter>
          <Link
            href={`https://finance.yahoo.com/quote/${stockSymbol}/`}
            isExternal
          >
            <Text className="underline">Check on Yahoo Finance</Text>
          </Link>
        </CardFooter>
      </Card>
    </section>
  )
}

export default StockInfo
