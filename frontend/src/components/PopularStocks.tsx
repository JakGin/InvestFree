import React from "react"
import Stock from "./Stock"

const PopularStocks = () => {
  return (
    <div>
      <h1>Popular Stocks</h1>
      <div className="Dashboard--section">
        <Stock />
        <Stock />
        <Stock />
        <Stock />
        <Stock />
        <Stock />
        <Stock />
        <Stock />
        <Stock />
      </div>
    </div>
  )
}

export default PopularStocks
