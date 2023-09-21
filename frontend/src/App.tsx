import { useState } from "react";
import Login from "/src/pages/auth/login";
import Register from "/src/pages/auth/register";
import logo from "/src/assets/logo.png";
import LogoutButton from "/src/components/LogoutButton"
import UserInfo from "./components/UserInfo";

function App() {
  const [user, setUser] = useState({isAuthenticated: false});

  return (
    <>
      <img src={logo} alt="logo" className="w-40 h-40" />
      <h1 className="text-3xl font-bold underline bg-cyan-600">
        This is app.tsx
      </h1>
      <Register user={user} setUser={setUser} />
      <Login user={user} setUser={setUser} />
      <LogoutButton user={user} setUser={setUser} >Logout</LogoutButton>

      <UserInfo user={user} setUser={setUser} />
    </>
  );
}

export default App;
