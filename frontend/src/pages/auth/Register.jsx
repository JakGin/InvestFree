import { useState, useEffect, useContext } from "react"
import { useNavigate, Link } from "react-router-dom"
import { AuthContext } from "/src/App"
import * as EmailValidator from "email-validator"
import { nanoid } from "nanoid"
import { BiSolidCheckSquare, BiErrorAlt } from "react-icons/bi"
import { getCSRFToken } from "@/utils/tokens"
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Button,
} from "@chakra-ui/react"
import { setCookie } from "@/utils/cookies"

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
    confirmPassword: "",
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
    [false, "Passwords must match"],
  ])

  const [constraintsElement, setConstraintsElement] = useState()

  const navigate = useNavigate()

  useEffect(() => {
    const username = credentials.username
    const email = credentials.email
    const password = credentials.password
    const confirmPassword = credentials.confirmPassword

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
      [password === confirmPassword, "Passwords must match"],
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
      confirmPassword: event.target[3].value,
    }

    const csrfToken = getCSRFToken()
    let response

    try {
      response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify(user),
        credentials: "include",
      })

      if (!response.ok) {
        //TODO
        console.log("Registration failed")
        return
      }

      response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({
          username: event.target[0].value,
          password: event.target[2].value,
        }),
        credentials: "include",
      })
      console.log(response)
      if (response.ok) {
        setIsAuthenticated(true)
        // Set isAuthenticated cookie to check if user is authneticated after
        // page refresh. sessionid cookie is httpOnly and can't be accessed
        setCookie("isAuthenticated", "true", 7)
        navigate("/dashboard")
      } else {
        //TODO
        console.log("Login failed")
      }
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
      } else if (index === 1) {
        return credentials.email !== "" ? true : false
      } else if ([2, 3, 4, 5, 6].includes(index)) {
        return credentials.password !== "" ? true : false
      } else {
        return credentials.confirmPassword !== "" ? true : false
      }
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
      <form
        onSubmit={handleSubmit}
        onChange={handleFormChange}
        className="flex flex-col gap-4 w-96 items-center self-center"
      >
        <FormControl isRequired>
          <FormLabel>Username</FormLabel>
          <Input name="username" />
          <FormHelperText>
            Username will be displayed on your Dashboard.
          </FormHelperText>
          <FormErrorMessage>Username is required.</FormErrorMessage>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Email address</FormLabel>
          <Input type="email" name="email" />
          <FormHelperText>We'll never share your email.</FormHelperText>
          <FormErrorMessage>Valid email is required.</FormErrorMessage>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <Input type="password" name="password" />
          <FormErrorMessage>
            There is something wrong with this password.
          </FormErrorMessage>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Repeat Password</FormLabel>
          <Input type="password" name="confirmPassword" />
          <FormErrorMessage>Passwords do not match.</FormErrorMessage>
        </FormControl>

        <Button type="submit" className="mt-6">
          Register
        </Button>
      </form>

      {constraintsElement}
      <Link to="/login" className="underline">
        Already have account. Login Here
      </Link>
    </div>
  )
}

export default Register
