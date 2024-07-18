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
import { getCSRFToken } from "@/utils/tokens"

const BuyStock = () => {
  const [stock, setStock] = useState<StocksData | undefined>(undefined)
  const [nUnits, setNUnits] = useState("")

  const { data, error, isLoading } = useSWR<StocksData[]>(
    "/get_stocks_data",
    fetcher
  )

  async function handleBuy(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/stock/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken() || "",
          },
          body: JSON.stringify({
            stockSymbol: stock?.T,
            unitPrice: stock?.c,
            quantity: Number(nUnits),
          }),
          credentials: "include",
        }
      )

      if (response.ok) {
        console.log("Stock bought successfully")
        // TO CHANGE
        alert(`Buying stock: ${stock?.T} with: ${nUnits} units`)
        setNUnits("")
      } else {
        const error = await response.json()
        console.error("Failed to buy stock", error)
      }
    } catch (error) {
      console.error("Failed to buy stock", error)
    }
  }

  return (
    <div className="flex flex-col gap-8 w-fit self-center">
      <section className="w-[350px]">
        <h1 className="text-2xl font-medium py-2">Search for a Stock</h1>
        <div>
          <Select
            placeholder="Select stock"
            value={stock?.T}
            onChange={(e) => {
              const stockSymbol = e.target.value
              const stock = data?.find((stock) => stock.T === stockSymbol)
              setStock(stock)
            }}
          >
            {data &&
              data.map((stock) => (
                <option key={stock.T} value={stock.T}>
                  {stock.T}
                </option>
              ))}
          </Select>
        </div>
      </section>

      {stock && (
        <>
          <div className="self-center w-[350px]">
            <StockInfo
              stockName={stock.name}
              stockSymbol={stock.T}
              price={stock.c}
              priceChange={-9.99}
              percentChange={-9.99}
            />
          </div>

          <section className="flex flex-col">
            <h1 className="text-2xl font-medium py-2">Order Units</h1>
            <form className="flex flex-col gap-4" onSubmit={handleBuy}>
              <FormControl isRequired>
                <FormLabel>Enter number of units to buy</FormLabel>
                <NumberInput
                  defaultValue={1}
                  min={1}
                  max={1000000}
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
                  <span>{formattedCurrency(stock.c * Number(nUnits))}</span>
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
