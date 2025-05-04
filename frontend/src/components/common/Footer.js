import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="foot bg-dark text-white mt-5 p-4 text-center">
      <div className="container">
        <h3 className="conTitle">Contact:</h3>
        <p className="contact">
          <a
            href="mailto:keerthanreddy.j139@ptuniv.edu.in"
            className="tooltip-container"
          >
            <i className="foot-list fa-solid fa-envelope"></i>
          </a>
          <a href="https://github.com/KJReddy03" className="tooltip-container">
            <i className="foot-list fa-brands fa-github"></i>
          </a>
          <a
            href="https://www.instagram.com/keerthan.reddy.j/"
            className="tooltip-container"
          >
            <i className="foot-list fa-brands fa-instagram"></i>
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
