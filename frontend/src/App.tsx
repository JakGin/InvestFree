import { useState } from "react";
import Login from "/src/pages/auth/login";
import Register from "/src/pages/auth/register";
import logo from "/src/assets/logo.png";
import LogoutButton from "/src/components/LogoutButton"
import UserInfo from "./components/UserInfo";
import { getCookie } from "/src/utils/cookies.tsx";

function App() {
  function fetchUser() {
    fetch(`${import.meta.env.VITE_API_URL}user`, {
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  }

  return (
    <>
      <img src={logo} alt="logo" className="w-40 h-40" />
      <h1 className="text-3xl font-bold underline bg-cyan-600">
        This is app.tsx
      </h1>
      <Register />
      <Login />
      <LogoutButton>Logout</LogoutButton>

      <button onClick={fetchUser}>Click to get user</button>
      {/* <UserInfo user={user} setUser={setUser} /> */}
    </>
  );
}

export default App;
