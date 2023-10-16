import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "/src/utils/ErrorMessage";

function Register() {
  const [error, setError] = useState({
    status: false,
    message: "",
  });

  const navigate = useNavigate();

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
      });
      navigate("/user");
    } catch (error) {
      if (error.response) {
        console.error(error.response.status);      
        setError({
          status: true,
          message: error.response.data.error,
        });
      } else if (error.request) {
        console.error("No response received. Server might be unreachable.");
      } else {
        console.error("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="Register--container">
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" required />
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <input type="submit" value="Register" />
        {error.status && <ErrorMessage text={error.message} />}
      </form>
    </div>
  );
}

export default Register;
