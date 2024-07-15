import React from "react"
import { useState, useEffect } from "react"
import Stock from "@/components/Stock"
import TextField from "@mui/material/TextField"
import Autocomplete from "@mui/material/Autocomplete"
import { Button } from "@mui/material"
import PopularStocks from "@/components/PopularStocks"
import BuyStock from "@/components/BuyStock"
import WalletBriefInfo from "@/components/WalletBriefInfo"

export default function Dashboard() {
  return (
    <div>
      <WalletBriefInfo />
      <BuyStock />
      <PopularStocks />
    </div>
  )
}
