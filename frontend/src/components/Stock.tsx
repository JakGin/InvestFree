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

function Stock({
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
        <Heading size="md">{stockName} ({stockTicker})</Heading>
      </CardHeader>
      <CardBody>
        <Text>View a summary of all your customers over the last month.</Text>
      </CardBody>
      <CardFooter>
      <Button>View here</Button>
    </CardFooter>
    </Card>
  )
}

export default Stock
