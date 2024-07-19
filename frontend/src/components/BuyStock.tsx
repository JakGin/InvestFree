import React, { useState } from "react"
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Select,
  Button,
  Text,
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
import useSWR, { mutate } from "swr"
import { fetcher } from "@/utils/fetcher"
import { StocksDataT } from "@/types"
import { getCSRFToken } from "@/utils/tokens"
import { BuyStockModal } from "./BuyStockModal"
import { useDisclosure } from "@chakra-ui/react"

const BuyStock = () => {
  const [stock, setStock] = useState<StocksDataT | undefined>(undefined)
  const [nUnits, setNUnits] = useState("")
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { data, error, isLoading } = useSWR<StocksDataT[]>(
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
            stockSymbol: stock?.stockSymbol,
            unitPrice: stock?.lastClosePrice,
            quantity: Number(nUnits),
          }),
          credentials: "include",
        }
      )

      if (response.ok) {
        onOpen()
        mutate("/user")
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
      {stock && (
        <BuyStockModal
          onOpen={onOpen}
          onClose={onClose}
          isOpen={isOpen}
          stock={stock}
          quantity={Number(nUnits)}
          setNUnits={setNUnits}
        />
      )}
      <section className="w-[350px]">
        <Text
          className="text-3xl font-bold py-4 text-center"
          bgGradient="linear-gradient(90deg, rgba(88,196,96,1) 30%, rgba(0,251,255,1) 100%)"
          bgClip="text"
        >
          Search for a Stock
        </Text>
        <div>
          <Select
            placeholder="Select stock"
            value={stock?.stockSymbol}
            onChange={(e) => {
              const stockSymbol = e.target.value
              const stock = data?.find(
                (stock) => stock.stockSymbol === stockSymbol
              )
              setStock(stock)
            }}
          >
            {data &&
              data.map((stock) => (
                <option key={stock.stockSymbol} value={stock.stockSymbol}>
                  {stock.stockSymbol}
                </option>
              ))}
          </Select>
        </div>
      </section>

      {stock && (
        <>
          <div className="self-center w-[350px]">
            <StockInfo
              stockName={stock.stockName}
              stockSymbol={stock.stockSymbol}
              price={stock.lastClosePrice}
              priceChange={stock.lastPriceChange}
              percentChange={stock.lastPriceChangePercentage}
            />
          </div>

          <section className="flex flex-col">
            <Text
              className="text-3xl font-bold py-4 text-center"
              bgGradient="linear-gradient(90deg, rgba(88,196,96,1) 30%, rgba(0,251,255,1) 100%)"
              bgClip="text"
            >
              Order Units
            </Text>
            <form className="flex flex-col gap-4" onSubmit={handleBuy}>
              <FormControl isRequired>
                <FormLabel>Enter number of units to buy</FormLabel>
                <NumberInput
                  defaultValue={1}
                  min={1}
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
                  <span>
                    {formattedCurrency(stock.lastClosePrice * Number(nUnits))}
                  </span>
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
