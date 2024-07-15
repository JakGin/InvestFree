import { Link } from "react-router-dom"
import { useState, useContext } from "react"
import { AuthContext } from "/src/App"
import Menu from "./Menu"

function Header() {
  return (
    <div className="Header--container">
      <Link className="Header--leftPanel" to="/">
        <img src="/src/img/logo.png" alt="logo" />
        <h1 className="font-medium tracking-wide text-lg">InvestFree</h1>
      </Link>

      <Menu />
    </div>
  )
}

export default Header
