import "/src/app.css"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const User = () => {
  const [loggedIn, setLoggedIn] = useState(false)
  const [user, setUser] = useState({})

  const navigate = useNavigate()

  useEffect(() => {
    async function getUser() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/user/`,
          {
            credentials: "include",
          }
        )

        const data = await response.json()

        setUser({
          username: data.user.username,
          email: data.user.email,
        })
        setLoggedIn(true)
      } catch (error) {
        if (error.response) {
          console.error(error.response.status)
          navigate("/login")
        } else if (error.request) {
          console.error("No response received. Server might be unreachable.")
        } else {
          console.error("An unexpected error occurred")
        }
      }
    }

    getUser()
  }, [navigate])

  if (!loggedIn) {
    return <p>Checking credentials ...</p>
  }

  return (
    <div className="User--container">
      <h1>User Page Here</h1>
      <h2>{user?.username}</h2>
      <h2>{user?.email}</h2>
    </div>
  )
}

export default User
