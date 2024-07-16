import { User } from "@/types"
import useSWR from "swr"

const fetcher = async (url: string): Promise<User> => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${url}/`, {
    credentials: "include",
  })

  if (!response.ok) {
    throw new Error("Failed to fetch")
  }
  const data = await response.json()
  return {
    user: {
      username: data.username,
      email: data.email,
    },
    moneyInAccount: data.money_in_account,
    moneyInStocks: data.money_in_stocks,
    wallet: {
      stocks: data.stocks.map((stock: any) => ({
        stockSymbol: stock.stock_symbol,
        stockName: stock.stock_name,
        StockBoughtPrice: stock.buy_unit_price,
        units: stock.quantity,
        buyDate: stock.buy_date,
        benefit: stock.current_benefit,
        benefitPercentage: stock.current_percentage_benefit,
      })),
    },
  }
}

export function useUser() {
  const { data, error, isLoading } = useSWR("/user", fetcher)

  return {
    userData: data,
    userError: error,
    userIsLoading: isLoading,
  }
}
