import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Logout() {
  const navigate = useNavigate()

  async function handleLogout(event) {
    try {
      await axios.post("/logout/");
      navigate("/login/")
    } catch (error) {
      if (error.response) {
        console.error(error.response.status)
      } else if (error.request) {
        console.error("No response received. Server might be unreachable.")
      } else {
        console.error("An unexpected error occurred");
      }
    }
  }

  return (
    <button onClick={handleLogout}>Logout</button>
  );
}

export default Logout;
