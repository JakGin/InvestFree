import { Autocomplete, Button, TextField } from "@mui/material"
import React, { useState } from "react"

const BuyStock = () => {
  const [stock, setStock] = useState("")
  const [nUnits, setNUnits] = useState("")

  const stocks = [
    "Stock 1",
    "Stock 2",
    "Stock 3",
    "Stock 4",
    "Stock 5",
    "Stock 6",
    "Stock 7",
    "Stock 8",
    "Stock 9",
    "Stock 10",
    "Stock 11",
    "Stock 12",
    "Stock 13",
    "Stock 14",
  ]

  return (
    <div>
      <h1>Search for a Stock</h1>
      <form>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={stocks}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Stock" />}
          value={stock}
          onChange={(event, newValue) => setStock(newValue as string)}
        />
        {stock}
        <h2>
          Current price for 1 unit: <span>34</span>$
        </h2>
        <h2>Info about a stock</h2>
        <h2>How many units would you like to buy?</h2>
        <TextField
          id="nUnits"
          label="Number of units"
          variant="outlined"
          type="number"
          value={nUnits}
          onChange={(event) => setNUnits(Number(event.target.value))}
        />
        <h2>Total price <span>{Number(nUnits) * 34}</span>$</h2>
        <Button variant="contained">Buy</Button>
      </form>
    </div>
  )
}

export default BuyStock
