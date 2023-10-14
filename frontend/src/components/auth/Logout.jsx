import { useEffect, useState } from "react";
import axios from "axios";

function Logout() {
  async function handleLogout(event) {
    try {
      await axios.post("/logout/");
      console.log("Logout successful");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <button onClick={handleLogout}>Logout</button>
  );
}

export default Logout;
