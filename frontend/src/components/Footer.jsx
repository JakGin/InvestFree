import { Link } from "@chakra-ui/react"
import React from "react"

function Footer() {
  return (
    <div className="Footer--container flex justify-between">
      <p>&copy; 2023 InvestFree. All Rights Reserved.</p>
      <p>
        Created by:{" "}
        <Link href="https://github.com/JakGin" className="inline-block" isExternal>
          <span className="whitespace-nowrap underline hover:text-green-500">Jakub Glinka</span>
        </Link>
      </p>
    </div>
  )
}

export default Footer
