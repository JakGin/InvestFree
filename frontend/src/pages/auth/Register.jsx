import axios from "axios"
import { useState, useEffect, useContext } from "react"
import { useNavigate, Link } from "react-router-dom"
import ErrorMessage from "/src/utils/ErrorMessage"
import { AuthContext } from "/src/App"
import * as EmailValidator from "email-validator"
import { nanoid } from "nanoid"
import { BiSolidCheckSquare, BiErrorAlt } from "react-icons/bi"
import { getCSRFToken } from "/src/utils/cookies"

function Register() {
  const [error, setError] = useState({
    status: false,
    message: "",
  })
  const setIsAuthenticated = useContext(AuthContext)[1]
  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password: "",
  })

  const [constraints, setConstraints] = useState([
    [false, "Username must be at least 3 characters long"],
    [false, "Email must be valid"],
    [false, "Password must contain at least one uppercase letter"],
    [false, "Password must contain at least one lowercase letter"],
    [false, "Password must contain at least one digit"],
    [
      false,
      "Password must contain at least one special character from the set #?!@$%^&*-",
    ],
    [false, "Password must be at least 8 characters long"],
  ])

  const [constraintsElement, setConstraintsElement] = useState()

  const navigate = useNavigate()

  useEffect(() => {
    const username = credentials.username
    const email = credentials.email
    const password = credentials.password

    setConstraints([
      [username.length >= 3, "Username must be at least 3 characters long"],
      [EmailValidator.validate(email), "Email must be valid"],
      [
        /[A-Z]/.test(password),
        "Password must contain at least one uppercase letter",
      ],
      [
        /[a-z]/.test(password),
        "Password must contain at least one lowercase letter",
      ],
      [/\d/.test(password), "Password must contain at least one digit"],
      [
        /[#!?@$%^&*-]/.test(password),
        "Password must contain at least one special character from the set #?!@$%^&*-",
      ],
      [password.length >= 8, "Password must be at least 8 characters long"],
    ])
  }, [credentials])

  useEffect(() => {
    const nonEmptyConstraints = getNoneEmptyConstraints()

    setConstraintsElement(
      <div className="Register--constraints">
        {nonEmptyConstraints.map((constraint) => (
          <div key={nanoid()} className="Register--constraint">
            <div>
              {constraint[0] ? (
                <BiSolidCheckSquare
                  color="#39ac31"
                  style={{ fontSize: "25" }}
                />
              ) : (
                <BiErrorAlt color="red" style={{ fontSize: "20" }} />
              )}{" "}
            </div>
            <p style={{ color: constraint[0] ? "#bedbbc" : "#dbbcbc" }}>
              {constraint[1]}
            </p>
          </div>
        ))}
      </div>
    )
  }, [constraints])

  const handleSubmit = async (event) => {
    event.preventDefault()
    const user = {
      username: event.target[0].value,
      email: event.target[1].value,
      password: event.target[2].value,
    }

    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCSRFToken(),
        },
        body: JSON.stringify(user),
        credentials: "include",
      })

      await fetch(`${import.meta.env.VITE_BACKEND_URL}/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCSRFToken(),
        },
        body: JSON.stringify({
          username: event.target[0].value,
          password: event.target[2].value,
        }),
        credentials: "include",
      })

      setIsAuthenticated(true)
      navigate("/user")
    } catch (error) {
      if (error.response) {
        console.error(error.response.status)
        setError({
          status: true,
          message: error.response.data.error,
        })
      } else if (error.request) {
        console.error("No response received. Server might be unreachable.")
      } else {
        console.error("An unexpected error occurred")
      }
    }
  }

  function getNoneEmptyConstraints() {
    const nonEmptyConstraints = constraints.filter((constraint, index) => {
      if (index === 0) {
        return credentials.username !== "" ? true : false
      }
      if (index === 1) {
        return credentials.email !== "" ? true : false
      }
      return credentials.password !== "" ? true : false
    })

    return nonEmptyConstraints
  }

  function handleFormChange(event) {
    setCredentials((oldData) => ({
      ...oldData,
      [event.target.name]: event.target.value,
    }))
  }

  return (
    <div className="Register--container">
      <form onSubmit={handleSubmit} onChange={handleFormChange}>
        <input type="text" name="username" placeholder="Username" required />
        <input type="email" name="email" placeholder="Email" required />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
        />
        <input type="submit" value="Register" />
        {error.status && <ErrorMessage text={error.message} />}
      </form>
      <Link to="/login">Already have account. Login Here</Link>
      {constraintsElement}
    </div>
  )
}

export default Register
