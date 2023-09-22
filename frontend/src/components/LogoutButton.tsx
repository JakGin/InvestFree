const LogoutButton = ({ children }) => {
    async function logout() {
        const response = await fetch(`${import.meta.env.VITE_API_URL}logout`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });

        const data = await response.json();
        console.log(data);
    }

  return <button onClick={logout}>{children}</button>;
};

export default LogoutButton;
