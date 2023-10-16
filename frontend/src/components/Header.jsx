import { NavLink } from "react-router-dom";
import { useState } from "react";

function Header() {
  const [clickListener, setClickListener] = useState(null);

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
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/register">Register</NavLink>
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/logout" >
            <span className="Header--logoutNav">Logout</span>
          </NavLink>
        </nav>
      </div>
    </div>
  );
}

export default Header;
