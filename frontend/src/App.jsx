import "/src/app.css"
import { useState, createContext } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "/src/pages/auth/Login"
import Register from "/src/pages/auth/Register"
import User from "/src/pages/User"
import Layout from "/src/components/Layout"
import Home from "/src/pages/Home"
import Dashboard from "/src/pages/Dashboard"
import NotFound from "/src/pages/NotFound"
import Wallet from "./pages/Wallet"

export const AuthContext = createContext(null)

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  return (
    <AuthContext.Provider value={[isAuthenticated, setIsAuthenticated]}>
      <div className="App--container">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="user" element={<User />} />
              <Route path="register" element={<Register />} />
              <Route path="login" element={<Login />} />
              <Route path="dashboard" element={<Dashboard />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthContext.Provider>
  )
}

export default App
