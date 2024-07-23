import { Link } from "react-router-dom"
import "/src/app.css"

function NotFound() {
  return (
    <div className="NotFound--container">
      <h1>404</h1>
      <div className="NotFound--img" />
      <h3>Look like you&apos;re lost</h3>
      <p>the page you are looking for not available!</p>
      <Link to="/">Go to Home</Link>
    </div>
  )
}

export default NotFound
