import { useState, useEffect } from "react";
import { getCookie } from "/src/utils/cookies.tsx";

const UserInfo = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  async function getUserInfo() {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}user`, {
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
        },
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Not authorized");
      }
      const data = await response.json();
      setUser((userData) => ({ ...userData, ...data }));

      setLoading(false);
      setError(false);
    } catch (error) {
      setError(true);
    }
  }

  useEffect(() => {
    getUserInfo();
  }, [user]);

  if (error) {
    return <p>There was an error</p>;
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>
      <p>Wallet Status: {user.wallet_status}</p>
      <p>Debt: {user.debt}</p>
    </>
  );
};

export default UserInfo;
