import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "/src/app.css";

const User = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function getUser() {
      try {
        await axios.get("/user/");
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
      <h1>User Page Here</h1>
    </div>
  );
};

export default User;
