import { useColorMode } from "@chakra-ui/react"
import { Moon, Sun } from "lucide-react"
import React from "react"

export function ThemeSwitcher() {
  const { colorMode, toggleColorMode } = useColorMode()
  return (
    <header>
      <div
        className="flex items-center space-x-2 cursor-pointer"
        onClick={toggleColorMode}
      >
        {colorMode === "light" ? (
          <div className="w-6 h-6 text-yellow-400">
            <Sun />
          </div>
        ) : (
          <div className="w-6 h-6 text-gray-500">
            <Moon />
          </div>
        )}
      </div>
    </header>
  )
}
