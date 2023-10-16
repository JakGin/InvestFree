import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "/src/App";
import { useContext } from "react";

function LogoutButton() {
  const navigate = useNavigate();
  const setIsAuthenticated = useContext(AuthContext)[1];

  async function handleLogout() {
    try {
      await axios.post("/logout/");
      setIsAuthenticated(false);
      navigate("/login/");
    } catch (error) {
      if (error.response) {
        console.error(error.response.status);
      } else if (error.request) {
        console.error("No response received. Server might be unreachable.");
      } else {
        console.error("An unexpected error occurred");
      }
    }
  }

  return <div onClick={handleLogout} className="LogoutButton">Logout</div>;
}

export default LogoutButton;
