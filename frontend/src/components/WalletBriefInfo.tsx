import React from "react"
import { Card, CardHeader, CardBody, CardFooter } from "@chakra-ui/react"
import { User, Wallet } from "lucide-react"
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

  return (
    <Card>
      <CardHeader>
        <h2 className="text-center text-2xl">{userData?.user.username}</h2>
      </CardHeader>
      <CardBody className="flex gap-12 lg:gap-16 justify-center">
        <div className="text-center">
          <div className="flex items-center gap-2">
            <User />
            <h2 className="font-bold text-2xl">Account</h2>
          </div>
          <h2 className="text-xl">
            {formattedCurrency(userData?.wallet?.account)}
          </h2>
        </div>
        <div className="text-center">
          <div className="flex items-center gap-2">
            <Wallet />
            <h2 className="font-bold text-2xl">Wallet</h2>
          </div>
          <h2 className="text-xl">
            {formattedCurrency(userData?.wallet?.wallet)}
          </h2>
        </div>
      </CardBody>
    </Card>
  )
}

export default WalletBriefInfo
