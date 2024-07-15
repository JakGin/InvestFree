import { Outlet } from "react-router-dom";
import Header from "/src/components/Header";
import Footer from "/src/components/Footer";

function Layout() {
  return (
    <div className="Layout--container">
      <Header />
      <main className="flex flex-col flex-1 w-screen items-center">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
