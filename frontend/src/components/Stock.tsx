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
import { useUser } from "@/hooks/useUser"
import { formattedPercent } from "@/utils/currency"

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

export function Stock2() {
  const { userData, userError, userIsLoading } = useUser()

  if (userIsLoading) {
    return (
      <Card>
        <CardHeader>
          <p>User Loading...</p>
        </CardHeader>
      </Card>
    )
  }

  if (userError) {
    return (
      <Card>
        <CardHeader>
          <h2 className="text-center text-2xl">Error</h2>
        </CardHeader>
        <CardBody>
          <p>Something went wrong ...</p>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card
      direction={{ base: "column", sm: "row" }}
      className="flex items-center"
    >
      <CardHeader>
        <h1>Apple Inc. (AAPL)</h1>
        <Text className="flex gap-2 items-center">
          {2.22 > 0 ? (
            <BiSolidUpArrow color="green" />
          ) : (
            <BiSolidDownArrow color="red" />
          )}
          {2.22} ({formattedPercent(1.21)})
        </Text>
      </CardHeader>
      <CardBody>
        <p>Current Price: $123.45</p>
        <p>Units: 10</p>
        <p>Buy date: 11.08.2021</p>
        <p>Stock Bought Price: $123.11</p>
        <p>Benefit: $123.45</p>
        <p>Benefit Percentage: 10%</p>
      </CardBody>
      <CardFooter>
        <form>
          <Button colorScheme="red">SELL</Button>
        </form>
      </CardFooter>
    </Card>
  )
}
