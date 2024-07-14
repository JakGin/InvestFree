import { useState, useEffect } from "react"
import Stock from "/src/components/Stock"

const url = `${import.meta.env.VITE_STOCK_API_URL}/AMZN`
const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": import.meta.env.VITE_X_RapidAPI_Key,
    "X-RapidAPI-Host": import.meta.env.VITE_X_RapidAPI_Host,
  },
}

function Dashboard() {
  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const response = await fetch(url, options)
      const result = await response.json()
      console.log(result)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="Dashboard--container">
      <div className="Dashboard--section">
        <Stock />
        <Stock />
        <Stock />
        <Stock />
      </div>
    </div>
  )
}

export default Dashboard
