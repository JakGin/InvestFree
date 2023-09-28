import { getCookie } from "/src/utils/cookies";

const Register = () => {
  async function handleSubmit(event) {
    event.preventDefault();
    const response = await fetch(`${import.meta.env.VITE_API_URL}register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: JSON.stringify({
        username: event.target.username.value,
        email: event.target.email.value,
        password: event.target.password.value,
        confirmation: event.target.confirmation.value,
      }),
      credentials: "include",
    });

    const data = await response.json();
    console.log(data);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="username" placeholder="Username" required />
      <input type="email" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Password" required />
      <input
        type="password"
        name="confirmation"
        placeholder="Password confirmation"
        required
      />
      <input type="submit" value="Register" />
    </form>
  );
};

export default Register;
