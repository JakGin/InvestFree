import { Stock2 } from "@/components/Stock"
import React from "react"

export default function Wallet() {

  return (
    <div className="flex flex-col gap-4">
      {/* {userData?.wallet.stocks.map((stock, index) => (
        <Stock2 key={index} />
      ))} */}
        <Stock2 />
        <Stock2 />
        <Stock2 />
      
    </div>
  )
}
