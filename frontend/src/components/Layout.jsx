import { Outlet } from "react-router-dom";
import Header from "/src/components/Header";
import Footer from "/src/components/Footer";

function Layout() {
  return (
    <div className="Layout--container">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
