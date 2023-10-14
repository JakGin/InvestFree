import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const user = {
      username: event.target[0].value,
      password: event.target[1].value,
    };

    try {
      await axios.post("/login/", user);
      navigate("/user");
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" required />
        <input type="password" placeholder="Password" required />
        <input type="submit" value="Login" />
      </form>
    </div>
  );
};

export default Login;
