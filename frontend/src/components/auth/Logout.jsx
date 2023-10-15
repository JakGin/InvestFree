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
      console.log(error);
    }
  }

  return (
    <button onClick={handleLogout}>Logout</button>
  );
}

export default Logout;
