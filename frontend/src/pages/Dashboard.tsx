import React from "react"
import { useState, useEffect } from "react"
import Stock from "@/components/Stock"
import TextField from "@mui/material/TextField"
import Autocomplete from "@mui/material/Autocomplete"

// const url = `${import.meta.env.VITE_STOCK_API_URL}/AMZN`
// const options = {
//   method: "GET",
//   headers: {
//     "X-RapidAPI-Key": import.meta.env.VITE_X_RapidAPI_Key,
//     "X-RapidAPI-Host": import.meta.env.VITE_X_RapidAPI_Host,
//   },
// }

function Dashboard() {
  const [stock, setStock] = useState("")
  // useEffect(() => {
  //   fetchData()
  // }, [])

  // async function fetchData() {
  //   try {
  //     const response = await fetch(url, options)
  //     const result = await response.json()
  //     console.log(result)
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  const stocks = [
    "Stock 1",
    "Stock 2",
    "Stock 3",
    "Stock 4",
    "Stock 5",
    "Stock 6",
    "Stock 7",
  ]

  return (
    <div>
      <h1>Search for a Stock</h1>
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={stocks}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Stock" />}
        value={stock}
        onChange={(event, newValue)=>setStock(newValue as string)}
      />
      <div className="Dashboard--container">
        <div className="Dashboard--section">
          <Stock />
          <Stock />
          <Stock />
          <Stock />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
