import { getCookie } from "/src/utils/cookies.tsx";

const LogoutButton = ({ children }) => { 
  async function logout() {
    console.log("logout button" + " " + getCookie("csrftoken"))


    const response = await fetch(`${import.meta.env.VITE_API_URL}logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      credentials: "include",
    });

    const data = await response.json();
    console.log(data);
  }

  return <button onClick={logout}>{children}</button>;
};

export default LogoutButton;
