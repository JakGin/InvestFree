import axios from "axios";
import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import ErrorMessage from "/src/utils/ErrorMessage";
import { AuthContext } from "/src/App";

function Login() {
  const [error, setError] = useState(false);
  const setIsAuthenticated = useContext(AuthContext)[1];

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const user = {
      username: event.target[0].value,
      password: event.target[1].value,
    };

    try {
      await axios.post("/login/", user);
      setIsAuthenticated(true);
      navigate("/user");
    } catch (error) {
      if (error.response) {
        console.error(error.response.status);
        setError(true);
      } else if (error.request) {
        console.error("No response received. Server might be unreachable.");
      } else {
        console.error("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="Login--container">
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" required />
        <input type="password" placeholder="Password" required />
        <input type="submit" value="Login" />
        {error && <ErrorMessage text="Invalid Username and/or Password!" />}
      </form>
      <Link to="/register">Don&apos;t have account. Register Here</Link>
    </div>
  );
}

export default Login;
