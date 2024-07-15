import { useNavigate } from "react-router-dom"
import { AuthContext } from "/src/App"
import { useContext } from "react"
import { getCSRFToken } from "@/utils/tokens"
import { MenuItem } from "@chakra-ui/react"
import { LogOut } from "lucide-react"

function LogoutButton() {
  const navigate = useNavigate()
  const setIsAuthenticated = useContext(AuthContext)[1]

  async function handleLogout() {
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/logout/`, {
        method: "POST",
        headers: {
          "X-CSRFToken": getCSRFToken(),
        },
        credentials: "include",
      })
      setIsAuthenticated(false)
      navigate("/login")
    } catch (error) {
      if (error.response) {
        console.error(error.response.status)
      } else if (error.request) {
        console.error("No response received. Server might be unreachable.")
      } else {
        console.error("An unexpected error occurred")
      }
    }
  }
  return (
    <MenuItem icon={<LogOut />} color="red" onClick={handleLogout}>
      Logout
    </MenuItem>
  )
}

export default LogoutButton
