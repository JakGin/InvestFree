import { User } from "@/types"
import useSWR from "swr"

const fetcher = async (url: string): Promise<User> => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${url}/`, {
    credentials: "include",
  })

  if (!response.ok) {
    throw new Error("Failed to fetch")
  }
  return response.json()
}

export function useUser() {
  const { data, error, isLoading } = useSWR("/user", fetcher)

  return {
    userData: data,
    userError: error,
    userIsLoading: isLoading,
  }
}
