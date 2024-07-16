import { useState, useContext } from "react"
import { useNavigate, Link } from "react-router-dom"
import { AuthContext } from "/src/App"
import { getCSRFToken } from "@/utils/tokens"
import { Button, FormControl, FormHelperText, FormLabel, Input } from "@chakra-ui/react"

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
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCSRFToken(),
        },
        body: JSON.stringify(user),
        credentials: "include",
      })
      setIsAuthenticated(true)
      navigate("/user")
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
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        <FormControl isRequired>
          <FormLabel>Username</FormLabel>
          <Input name="username" />
          <FormHelperText>
            Username will be displayed on your Dashboard.
          </FormHelperText>
        </FormControl>
        {/* <FormControl isRequired>
          <FormLabel>Email address</FormLabel>
          <Input type="email" name="email" />
          <FormHelperText>We'll never share your email.</FormHelperText>
          <FormErrorMessage>Valid email is required.</FormErrorMessage>
        </FormControl> */}
        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <Input type="password" name="password" />
        </FormControl>

        <Button type="submit" className="mt-6">
          Login
        </Button>
      </form>
      <Link to="/register">Don&apos;t have account. Register Here</Link>
    </div>
  )
}

export default Login
