import { Button, useColorMode } from "@chakra-ui/react"
import React from "react"

export function ThemeSwitcher() {
  const { colorMode, toggleColorMode } = useColorMode()
  return (
    <header>
      <Button onClick={toggleColorMode}>
        Toggle {colorMode === "light" ? "Dark" : "Light"}
      </Button>
    </header>
  )
}
