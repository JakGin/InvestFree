import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "/src/app.css";
import Logout from "/src/components/auth/Logout";

const User = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    async function getUser() {
      try {
        const response = await axios.get("/user/");
        
        setUser({
          username: response.data.user.username,
          email: response.data.user.email,
        })
        setLoggedIn(true)
      } catch (error) {
        console.log(error);
        navigate("/login");
      }
    }

    getUser();
  }, []);

  if (!loggedIn) {
    return <p>Checking credentials ...</p>;
  }

  return (
    <div className="User--container">
      <Logout />
      <h1>User Page Here</h1>
      <h2>{user?.username}</h2>
      <h2>{user?.email}</h2>
    </div>
  );
};

export default User;