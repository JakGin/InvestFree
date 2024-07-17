import React, { useState } from "react"
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Select,
  Button,
} from "@chakra-ui/react"
import { formattedCurrency, formattedPercent } from "@/utils/currency"
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react"
import StockInfo from "./StockInfo"
import useSWR from "swr"
import { fetcher } from "@/utils/fetcher"
import { StocksData } from "@/types"

const BuyStock = () => {
  const [stock, setStock] = useState("")
  const [nUnits, setNUnits] = useState("1")

  const { data, error, isLoading } = useSWR<StocksData>(
    "/get_stocks_data",
    fetcher
  )

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h1 className="text-2xl font-medium py-2">Search for a Stock</h1>
        <div>
          <Select
            placeholder="Select stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          >
            {data &&
              data.results.sort((stockA, stockB) => {
                if (stockA.T < stockB.T) return -1
                if (stockA.T > stockB.T) return 1
                return 0
              }).map((stock) => (
                <option key={stock.T} value={stock.T}>
                  {stock.T}
                </option>
              ))}
          </Select>
        </div>
      </section>

      {stock && (
        <>
          <StockInfo
            stockName={stock}
            stockSymbol={stock}
            price={234.99}
            priceChange={-2.34}
            percentChange={-0.99}
          />

          <section className="flex flex-col">
            <h1 className="text-2xl font-medium py-2">Order Units</h1>
            <form className="flex flex-col gap-4">
              <FormControl isRequired>
                <FormLabel>Enter number of units to buy</FormLabel>
                <NumberInput
                  defaultValue={1}
                  min={1}
                  max={20}
                  precision={0}
                  name="units"
                  onChange={(value) => setNUnits(value)}
                  value={nUnits}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <FormHelperText>
                  Number of units has to be an integer greater than 0
                </FormHelperText>
              </FormControl>

              {Number(nUnits) > 0 && (
                <p className="font-medium text-lg">
                  Total cost:{" "}
                  <span>{formattedCurrency(234.99 * Number(nUnits))}</span>
                </p>
              )}

              <Button type="submit" isDisabled={Number(nUnits) <= 0}>
                BUY
              </Button>
            </form>
          </section>
        </>
      )}
    </div>
  )
}

export default BuyStock
