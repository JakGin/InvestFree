import React from 'react'
import { BiSolidDownArrow, BiSolidUpArrow } from "react-icons/bi";

function Stock() {
  return (
    <div className="Stock--container">
        <img src="" alt="stock-logo" />
        <h4>Stock Name</h4>
        <p>$ 127.12</p>
        <div>
            <BiSolidDownArrow />
            2.34%
        </div>
    </div>
  )
}

export default Stock