import { Link } from "react-router-dom"
import { useState, useContext } from "react"
import { AuthContext } from "/src/App"
import Menu from "./Menu"
import { ThemeSwitcher } from "./ThemeSwitcher"

function Header() {
  return (
    <nav className="Header--container">
      <Link className="Header--leftPanel" to="/">
        <img src="/src/img/logo.png" alt="logo" />
        <h1 className="font-medium tracking-wide text-lg">InvestFree</h1>
      </Link>
      <div className="flex items-center gap-4">
        <ThemeSwitcher />

        <Menu />
      </div>
    </nav>
  )
}

export default Header
