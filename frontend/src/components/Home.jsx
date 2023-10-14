import { useEffect, useState } from "react";
import axios from "axios";
import "/src/app.css";

const Home = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function authenticate() {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/home/`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setMessage(data.message);
      } catch (e) {
        console.log("not auth");
      }
    }

    authenticate();
  }, []);

  return (
    <div className="Home--container">
      <h3>Hi {message}</h3>
    </div>
  );
};

export default Home;
