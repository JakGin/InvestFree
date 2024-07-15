import React from "react"
import PopularStocks from "@/components/PopularStocks"
import BuyStock from "@/components/BuyStock"
import WalletBriefInfo from "@/components/WalletBriefInfo"

export default function Dashboard() {
  return (
    <div>
      <WalletBriefInfo />
      <BuyStock />
      {/* <PopularStocks /> */}
    </div>
  )
}
