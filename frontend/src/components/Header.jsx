import { Link, NavLink } from "react-router-dom";
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
    <>
    <div className="Header--container">
      <Link className="Header--leftPanel" to="/">
        <img src="/src/img/logo.png" alt="logo" />
        <h1 className="font-medium tracking-wide text-lg">InvestFree</h1>
      </Link>
      <div>
        <div className="Header--rightPanel" onMouseDown={showHideNav}>
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
    {/* div that replace normal flow of sticky header with position: fixed */}
    <div style={{height: "60px"}}></div>
    </>
  );
}

export default Header;
