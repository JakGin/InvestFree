import { StockInWallet } from "@/components/Stock"
import { useUser } from "@/hooks/useUser"
import { Button, Heading, Text } from "@chakra-ui/react"
import { WalletIcon } from "lucide-react"
import React from "react"

export default function Wallet() {
  const { userData, userError, userIsLoading } = useUser()

  if (userIsLoading) return <div>Loading...</div>
  if (userError) return <div>Error loading user data</div>
  if (!userData) return <div>No user data</div>

  return (
    <div className="flex flex-col gap-4 max-w-7xl self-center h-full">
      <Heading textAlign="center">
        <Text
          bgGradient="linear-gradient(90deg, rgba(88,196,96,1) 30%, rgba(0,251,255,1) 100%)"
          bgClip="text"
          mb={6}
        >
          Your Wallet
        </Text>
      </Heading>
      {userData.stocksOwned.length > 0 ? (
        userData.stocksOwned.map((stock: any, index: any) => (
          <StockInWallet key={index} stock={stock} />
        ))
      ) : (
        <div className="flex flex-col items-center gap-6 justify-center pb-28 h-full">
          <WalletIcon size={96} />
          <Text className="text-2xl font-semibold">Your wallet is empty</Text>
          <Text className="opacity-70">You can buy stocks on Dashboard</Text>
          <a href="/dashboard">
            <Button bgColor="green">Dashboard</Button>
          </a>
        </div>
      )}
    </div>
  )
}
