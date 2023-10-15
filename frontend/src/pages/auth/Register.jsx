import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault();
    const user = {
      username: event.target[0].value,
      email: event.target[1].value,
      password: event.target[2].value,
    };

    try {
      await axios.post("/register/", user);
      await axios.post("/login/", {
        username: event.target[0].value,
        password: event.target[2].value,
      })
      navigate("/user");
    } catch (error) {
      if (error.response) {
        console.error(error.response.status)
      } else if (error.request) {
        console.error("No response received. Server might be unreachable.")
      } else {
        console.error("An unexpected error occurred");
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" required />
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <input type="submit" value="Register" />
      </form>
    </div>
  )
}

export default Register