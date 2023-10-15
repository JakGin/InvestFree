import React from "react";
import "/src/app.css";

function NotFound() {
  return (
    <div className="NotFound--container">
      <h1>404</h1>
      <div className="NotFound--img" />
      <h3>Look like you're lost</h3>
      <p>the page you are looking for not avaible!</p>
      <a href={`${import.meta.env.VITE_FRONTEND_URL}/`}>Go to Home</a>
    </div>
  );
}

export default NotFound;
