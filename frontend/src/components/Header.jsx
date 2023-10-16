import React from 'react'

function Header() {
  return (
    <div className="Header--container">
      <div className="Header--leftPanel">
        <img src="/src/img/logo.png" alt="logo" />
        <h1>InvestFree</h1>
      </div>
      <nav>
        <a href="">Home</a>
        <a href="">Dashboard</a>
        <a href="">Login</a>
        <a href="">Logout</a>
      </nav>
    </div>
  )
}

export default Header