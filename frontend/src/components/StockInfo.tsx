import { formattedCurrency, formattedPercent } from "@/utils/currency"
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  Link,
  Stat,
  StatArrow,
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
      <Text
        className="text-3xl font-bold py-4 text-center"
        bgGradient="linear-gradient(90deg, rgba(88,196,96,1) 30%, rgba(0,251,255,1) 100%)"
        bgClip="text"
      >
        Stock Information
      </Text>
      <Card>
        <CardHeader>
          <Heading size="md" textAlign="center">
            {stockSymbol}, {stockName}
          </Heading>
        </CardHeader>
        <CardBody className="flex gap-4 justify-between">
          <Text className="text-center">
            Price for unit
            <div className="text-lg font-medium">
              {formattedCurrency(price)}
            </div>
          </Text>
          <Text className="text-center">
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
        <CardFooter>
          <Link
            href={`https://finance.yahoo.com/quote/${stockSymbol}/`}
            isExternal
            width="100%"
          >
            <Text className="underline text-center opacity-50">Check on Yahoo Finance</Text>
          </Link>
        </CardFooter>
      </Card>
    </section>
  )
}

export default StockInfo
