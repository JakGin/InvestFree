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
import { Link } from "react-router-dom"

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
          {stockChange} ({stockPercentage}%)
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

export default Stock
