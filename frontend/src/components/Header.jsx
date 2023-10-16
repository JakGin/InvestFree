import { NavLink } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "/src/App";
import LogoutButton from "/src/pages/auth/LogoutButton";

function Header() {
  const [clickListener, setClickListener] = useState(null);

  const isAuthenticated = useContext(AuthContext)[0];

  function showHideNav() {
    const nav = document.querySelector(".Header--nav");
    if (nav.style.display === "none") {
      nav.style.display = "flex";

      const clickListener = (event) => {
        if (
          event?.target.classList.value !== "Header--nav" &&
          event?.target.classList.value !== "Header--rightPanel" &&
          event?.target.classList.value != null
        ) {
          document.removeEventListener("click", clickListener);
          nav.style.display = "none";
          setClickListener(null);
        }
      };

      setClickListener(clickListener);
      document.addEventListener("click", clickListener);
    } else {
      nav.style.display = "none";
      document.removeEventListener("click", clickListener);
      setClickListener(null);
    }
  }

  return (
    <div className="Header--container">
      <div className="Header--leftPanel">
        <img src="/src/img/logo.png" alt="logo" />
        <h1>InvestFree</h1>
      </div>
      <div>
        <div className="Header--rightPanel" onClick={showHideNav}>
          <hr />
          <hr />
          <hr />
        </div>
        <nav className="Header--nav" style={{ display: "none" }}>
          <NavLink to="/">Home</NavLink>
          {isAuthenticated && <NavLink to="/dashboard">Dashboard</NavLink>}
          <NavLink to="/register">Register</NavLink>
          <NavLink to="/login">Login</NavLink>
          {isAuthenticated && <LogoutButton />}
        </nav>
      </div>
    </div>
  );
}

export default Header;
