import { useUser } from "@/hooks/useUser"
import { getCSRFToken } from "@/utils/tokens"
import { Button, Heading, Input, Text } from "@chakra-ui/react"
import React from "react"
import { mutate } from "swr"

const User = () => {
  const { userData, userIsLoading, userError } = useUser()
  const [editField, setEditField] = React.useState({
    username: false,
    email: false,
    password: false,
  })
  const [errors, setErrors] = React.useState({
    username: "",
    email: "",
    password: "",
  })

  if (userIsLoading) return <div>Loading...</div>
  if (userError) return <div>Failed to load data</div>
  if (!userData) return <div>No data</div>

  async function handleUsernameChange(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      const target = event.target as HTMLFormElement
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/change_username/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken(),
          } as HeadersInit,
          body: JSON.stringify({ username: target.username.value }),
          credentials: "include",
        }
      )
      if (!response.ok) {
        console.log("Username change failed")
        const data = await response.json()
        setErrors((oldErrors) => {
          return { ...oldErrors, username: data.error }
        })
      } else {
        mutate("/user")
        setEditField((oldEditField) => {
          return { ...oldEditField, username: false }
        })
        setErrors((oldErrors) => {
          return { ...oldErrors, username: "" }
        })
      }
    } catch (error: any) {
      if (error.response) {
        console.log(error.response.data)
      }
    }
  }

  async function handleEmailChange(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      const target = event.target as HTMLFormElement
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/change_email/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken(),
          } as HeadersInit,
          body: JSON.stringify({ email: target.email.value }),
          credentials: "include",
        }
      )
      if (!response.ok) {
        console.log("Email change failed")
        const data = await response.json()
        setErrors((oldErrors) => {
          return { ...oldErrors, email: data.error }
        })
      } else {
        mutate("/user")
        setEditField((oldEditField) => {
          return { ...oldEditField, email: false }
        })
        setErrors((oldErrors) => {
          return { ...oldErrors, email: "" }
        })
      }
    } catch (error: any) {
      if (error.response) {
        console.log(error.response.data)
      }
    }
  }

  async function handlePasswordChange(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      const target = event.target as HTMLFormElement
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/change_password/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken(),
          } as HeadersInit,
          body: JSON.stringify({
            oldPassword: target.oldPassword.value,
            newPassword: target.newPassword.value,
            confirmNewPassword: target.confirmNewPassword.value,
          }),
          credentials: "include",
        }
      )
      if (!response.ok) {
        console.log("Password change failed")
        const data = await response.json()
        setErrors((oldErrors) => {
          return { ...oldErrors, password: data.error }
        })
      } else {
        setEditField((oldEditField) => {
          return { ...oldEditField, password: false }
        })
        setErrors((oldErrors) => {
          return { ...oldErrors, password: "" }
        })
        alert("Password changed successfully!")
      }
    } catch (error: any) {
      if (error.response) {
        console.log(error.response.data)
      }
    }
  }

  return (
    <div>
      <Heading
        bgGradient="linear-gradient(90deg, rgba(88,196,96,1) 30%, rgba(0,251,255,1) 100%)"
        bgClip="text"
        className="font-bold text-center pb-8"
      >
        Your Profile
      </Heading>

      <div className="flex flex-col gap-6">
        <div className="flex gap-4 justify-center items-center text-lg">
          <h2>Username: </h2>
          <Text className="text-green-500 pr-8">{userData.username}</Text>
          <Button
            colorScheme="blue"
            onClick={() => {
              setEditField((oldEditField) => {
                return { ...oldEditField, username: !oldEditField.username }
              })
            }}
          >
            Edit
          </Button>
        </div>
        {editField.username && (
          <>
            <form
              onSubmit={handleUsernameChange}
              className="flex flex-col items-center gap-4"
            >
              <Input
                type="text"
                name="username"
                placeholder="New Username"
                className="max-w-96"
                required
              />
              <Button type="submit">Change Username</Button>
            </form>
            {errors.username && (
              <div className="text-red-500 text-center ">
                <Text>Username change failed!</Text>
                <Text>{errors.username}</Text>
              </div>
            )}
          </>
        )}

        <div className="flex gap-4 justify-center items-center text-lg">
          <h2>Email: </h2>
          <Text className="text-green-500 pr-8">{userData.email}</Text>
          <Button
            colorScheme="blue"
            onClick={() => {
              setEditField((oldEditField) => {
                return { ...oldEditField, email: !oldEditField.email }
              })
            }}
          >
            Edit
          </Button>
        </div>
        {editField.email && (
          <div>
            <form
              onSubmit={handleEmailChange}
              className="flex flex-col items-center gap-4"
            >
              <Input
                type="email"
                name="email"
                placeholder="New Email"
                className="max-w-96"
                required
              />
              <Button type="submit">Change Email</Button>
            </form>
            {errors.email && (
              <div className="text-red-500 text-center ">
                <Text>Email change failed!</Text>
                <Text>{errors.email}</Text>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-4 justify-center items-center text-lg">
          <Button
            colorScheme="blue"
            onClick={() => {
              setEditField((oldEditField) => {
                return { ...oldEditField, password: !oldEditField.password }
              })
            }}
          >
            Change Password
          </Button>
        </div>
        {editField.password && (
          <>
            <form
              onSubmit={handlePasswordChange}
              className="flex flex-col items-center gap-4"
            >
              <Input
                type="password"
                name="oldPassword"
                placeholder="Old Password"
                className="max-w-96"
                required
              />
              <Input
                type="password"
                name="newPassword"
                placeholder="New Password"
                className="max-w-96"
                required
              />
              <Input
                type="password"
                name="confirmNewPassword"
                placeholder="Repeat New Password"
                className="max-w-96"
                required
              />
              <Button type="submit">Change Password</Button>
            </form>
            {errors.password && (
              <div className="text-red-500 text-center ">
                <Text>Password change failed!</Text>
                <Text>{errors.password}</Text>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default User
