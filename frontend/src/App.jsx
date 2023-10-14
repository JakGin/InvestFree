import "./app.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "/src/components/auth/Login";
import Logout from "/src/components/auth/Logout";
import Register from "/src/components/auth/Register";
import User from "/src/components/User";

function App() {
  return (
    <BrowserRouter>
      <Navigation></Navigation>
      <Routes>
        <Route path="/user" element={<User />} />
        {/* <Route path="/register" element={<Register />} /> */}
        <Route path="/login" element={<Login />} />
        {/* <Route path="/logout" element={<Logout />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
