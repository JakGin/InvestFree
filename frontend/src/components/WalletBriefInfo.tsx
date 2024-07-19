import React from "react"
import { Card, CardHeader, CardBody, CardFooter, Text } from "@chakra-ui/react"
import { Banknote, User, Wallet } from "lucide-react"
import { formattedCurrency } from "@/utils/currency"
import { useUser } from "@/hooks/useUser"

const WalletBriefInfo = () => {
  const { userData, userError, userIsLoading } = useUser()

  if (userIsLoading) {
    return (
      <Card>
        <CardHeader>
          <p>User Loading...</p>
        </CardHeader>
      </Card>
    )
  }

  if (userError) {
    return (
      <Card>
        <CardHeader>
          <h2 className="text-center text-2xl">Error</h2>
        </CardHeader>
        <CardBody>
          <p>Something went wrong ...</p>
        </CardBody>
      </Card>
    )
  }

  if (!userData) {
    return <div></div>
  }

  return (
    <Card className="w-fit self-center">
      <CardHeader>
        <Text
          className="text-center text-3xl font-bold"
          bgGradient="linear-gradient(90deg, rgba(88,196,96,1) 30%, rgba(0,251,255,1) 100%)"
          bgClip="text"
        >
          {userData.username}
        </Text>
      </CardHeader>
      <CardBody className="flex gap-12 lg:gap-16 justify-center">
        <div className="text-center">
          <div className="flex items-center gap-2">
            <User className="text-green-500" />
            <h2 className="font-bold text-2xl">Account</h2>
          </div>
          <h2 className="text-xl">
            {formattedCurrency(userData.moneyInAccount)}
          </h2>
        </div>
        <div className="text-center">
          <div className="flex items-center gap-2">
            <Wallet className="text-green-500" />
            <h2 className="font-bold text-2xl">Wallet</h2>
          </div>
          <h2 className="text-xl">
            {formattedCurrency(userData.moneyInStocks)}
          </h2>
        </div>
      </CardBody>
      <CardFooter className="self-center">
        <p className="text-center">
          <div className="flex items-center gap-2">
            <Banknote className="text-green-500" />
            <h2 className="font-bold text-2xl">Total</h2>
          </div>
          <h2 className="text-xl">
            {formattedCurrency(
              userData.moneyInAccount + userData.moneyInStocks
            )}
          </h2>
        </p>
      </CardFooter>
    </Card>
  )
}

export default WalletBriefInfo
