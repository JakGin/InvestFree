import React, { useContext } from "react"

import {
  Menu as ChakraMenu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  IconButton,
} from "@chakra-ui/react"
import { AddIcon, HamburgerIcon } from "@chakra-ui/icons"
import { AreaChart, LogIn, LogOut, PersonStanding, Wallet } from "lucide-react"
import { Link } from "react-router-dom"
import { AuthContext } from "@/App"
import LogoutButton from "./LogoutButton"

const Menu = () => {
  const isAuthenticated = useContext(AuthContext)?.[0]

  return (
    <ChakraMenu>
      <MenuButton
        as={IconButton}
        aria-label="Options"
        icon={<HamburgerIcon />}
        variant="outline"
        colorScheme="green"
      />
      <MenuList>
        {isAuthenticated && (
          <Link to="/dashboard">
            <MenuItem icon={<AreaChart />}>Dashboard</MenuItem>
          </Link>
        )}
        {isAuthenticated && (
          <Link to="/wallet">
            <MenuItem icon={<Wallet />}>Wallet</MenuItem>
          </Link>
        )}
        {!isAuthenticated && (
          <Link to="/login">
            <MenuItem icon={<LogIn />}>Login / Register</MenuItem>
          </Link>
        )}
        <Link to="/rankings">
          <MenuItem icon={<PersonStanding />}>Top Players</MenuItem>
        </Link>
        {isAuthenticated && <LogoutButton />}
      </MenuList>
    </ChakraMenu>
  )
}

export default Menu
