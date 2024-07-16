import { User } from "@/types"
import { getCSRFToken } from "@/utils/tokens"
import useSWR from "swr"

export function useUser() {
  const fetcher = async (): Promise<User> => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user`, {
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
    userData: data,
    userError: error,
    userIsLoading: isLoading,
  }
}
