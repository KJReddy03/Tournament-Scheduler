import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="foot bg-dark text-white mt-5 p-4 text-center">
      <div className="container">
        <p>Gaming Tournament Scheduler &copy; {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
};

export default Footer;
