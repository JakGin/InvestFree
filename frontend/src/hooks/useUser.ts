import { UserT } from "@/types"
import useSWR from "swr"

const fetcher = async (url: string): Promise<UserT> => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${url}/`, {
    credentials: "include",
  })

  if (!response.ok) {
    throw new Error("Failed to fetch")
  }

  return await response.json()
}

export function useUser() {
  const { data, error, isLoading } = useSWR("/user", fetcher)

  return {
    userData: data,
    userError: error,
    userIsLoading: isLoading,
  }
}
