import { useState, useContext } from "react"
import { useNavigate, Link } from "react-router-dom"
import { AuthContext } from "/src/App"
import { getCSRFToken } from "@/utils/tokens"
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
} from "@chakra-ui/react"
import { setCookie } from "@/utils/cookies"

function Login() {
  const [error, setError] = useState(false)
  const setIsAuthenticated = useContext(AuthContext)[1]

  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    const user = {
      username: event.target[0].value,
      password: event.target[1].value,
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/login/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken(),
          },
          body: JSON.stringify(user),
          credentials: "include",
        }
      )
      if (response?.ok) {
        setIsAuthenticated(true)
        // Set isAuthenticated cookie to check if user is authneticated after
        // page refresh. sessionid cookie is httpOnly and can't be accessed
        setCookie("isAuthenticated", "true", 7)
        navigate("/dashboard")
      } else {
        // TODO
        console.log("Login failed")
        setError(true)
      }
    } catch (error) {
      if (error.response) {
        console.error(error.response.status)
        setError(true)
      } else if (error.request) {
        console.error("No response received. Server might be unreachable.")
      } else {
        console.error("An unexpected error occurred")
      }
    }
  }

  return (
    <div className="Login--container">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-96 items-center self-center">
        <FormControl isRequired>
          <FormLabel>Username</FormLabel>
          <Input name="username" />
          <FormHelperText>Your username</FormHelperText>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <Input type="password" name="password" />
        </FormControl>

        <Button type="submit" className="mt-6">
          Login
        </Button>
      </form>

      {error && (
        <div className="text-red-500 text-center">
          Invalid username or password
        </div>
      )}

      <Link to="/register" className="underline">
        Don&apos;t have account. Register Here
      </Link>
    </div>
  )
}

export default Login
