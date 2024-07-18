import { Stock2 } from "@/components/Stock"
import { useUser } from "@/hooks/useUser"
import { Heading } from "@chakra-ui/react"
import React from "react"

export default function Wallet() {
  const { userData, userError, userIsLoading } = useUser()

  return (
    <div className="flex flex-col gap-4 max-w-7xl self-center">
      <Heading textAlign="center">Your Wallet</Heading>
      {userData?.wallet.stocks.map((stock, index) => (
        <Stock2 
          key={index}
          stock={stock}
        />
      ))}
    </div>
  )
}
