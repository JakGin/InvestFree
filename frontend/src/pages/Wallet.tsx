import { StockInWallet } from "@/components/Stock"
import { useUser } from "@/hooks/useUser"
import { Heading, Text } from "@chakra-ui/react"
import React from "react"

export default function Wallet() {
  const { userData, userError, userIsLoading } = useUser()

  if (userIsLoading) return <div>Loading...</div>
  if (userError) return <div>Error loading user data</div>
  if (!userData) return <div>No user data</div>

  return (
    <div className="flex flex-col gap-4 max-w-7xl self-center">
      <Heading textAlign="center">
        <Text
          bgGradient="linear-gradient(90deg, rgba(88,196,96,1) 30%, rgba(0,251,255,1) 100%)"
          bgClip="text"
          mb={6}
        >
          Your Wallet
        </Text>
      </Heading>
      {userData.stocksOwned.map((stock, index) => (
        <StockInWallet key={index} stock={stock} />
      ))}
    </div>
  )
}
