const Login = ({ user, setUser }) => {
  async function handleSubmit(event: any) {
    event.preventDefault();
    const response = await fetch(`${import.meta.env.VITE_API_URL}login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: event.target.username.value,
        password: event.target.password.value,
      }),
      credentials: "include",
    });

    const data = await response.json();

    if (response.ok) {
      setUser((userData) => ({ isAuthenticated: true }));
    } else {
      setUser((userData) => ({ isAuthenticated: false }));
    }

    console.log(data);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="username" placeholder="Username" required />
      <input type="password" name="password" placeholder="Password" required />
      <input type="submit" value="Login" />
    </form>
  );
};

export default Login;
