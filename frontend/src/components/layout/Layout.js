import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../common/Navbar";
import Footer from "../common/Footer";
import "./Layout.css";

const Layout = ({ children }) => {
  const location = useLocation();

  const getBackgroundClass = (pathname) => {
    if (pathname === "/") return "home-bg";
    if (pathname === "/login") return "login-bg";
    if (pathname === "/register") return "register-bg";
    if (pathname === "/tournaments/create") return "create-bg";
    if (pathname === "/tournaments/update-results") return "result-bg";
    if (pathname === "/welcome") return "welcome-bg";
    if (pathname === "/tournaments") return "tournament-bg";
    if (pathname.startsWith("/tournaments")) return "result-bg";
    if (pathname.startsWith("/admin")) return "admin-bg";
    if (pathname.startsWith("/teams")) return "team-bg";
    return "default-bg";
  };

  const backgroundClass = getBackgroundClass(location.pathname);

  return (
    <div className={`layout-container ${backgroundClass}`}>
      <Navbar />
      <main className="layout-main-content">
        <div className="content-wrapper">{children}</div>
      </main>
      <Footer />
    </div>
  );
};
export default Layout;
