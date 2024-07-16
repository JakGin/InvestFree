import { Outlet } from "react-router-dom";
import Header from "/src/components/Header";
import Footer from "/src/components/Footer";

function Layout() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex flex-col flex-1 items-center p-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
