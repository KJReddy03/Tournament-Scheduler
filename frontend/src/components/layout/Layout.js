import React from "react";
import Navbar from "../common/Navbar";
import Footer from "../common/Footer";
import "./Layout.css";

const Layout = ({ children }) => {
  return (
    <div className="layout-container">
      <Navbar />
      <main className="layout-main-content">
        <div className="content-wrapper">{children}</div>
      </main>
      <Footer />
    </div>
  );
};
export default Layout;
