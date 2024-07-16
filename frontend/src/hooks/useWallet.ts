import { Wallet } from "@/types"
import { getCSRFToken } from "@/utils/tokens"
import useSWR from "swr"

export function useWallet() {
  const fetcher = async (): Promise<Wallet> => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/wallet`, {
      headers: {
        "X-CSRFToken": getCSRFToken() || "",
      },
      credentials: "include",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch")
    }

    return response.json()
  }

  const { data, error, isLoading } = useSWR(
    `${import.meta.env.VITE_BACKEND_URL}/wallet`,
    fetcher
  )

  return {
    walletData: data,
    walletError: error,
    walletIsLoading: isLoading,
  }
}
