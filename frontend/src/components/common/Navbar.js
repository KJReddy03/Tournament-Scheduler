import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../redux/actions/authActions";
import "./Navbar.css";

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="navbar-brand navTitle" to="/">
                <i className="fa-solid fa-gamepad"></i>Tournament Scheduler
              </Link>
            </li>
          </ul>
          <ul className="link-content">
            <li className="nav-item  tooltip-container">
              <Link className="nav-link" to="/">
                <i className="navele fa-solid fa-house"></i>
                <span className="tooltip-text">Home</span>
              </Link>
            </li>
            {isAuthenticated && (
              <>
                <li className="nav-item tooltip-container">
                  <Link className="nav-link" to="/tournaments">
                    <i className="navele fa-solid fa-trophy"></i>
                    <span className="tooltip-text">Tournaments</span>
                  </Link>
                </li>
                {user?.role === "admin" && (
                  <>
                    <li className="nav-item tooltip-container">
                      <Link className="nav-link" to="/tournaments/create">
                        <i className="navele fa-solid fa-square-plus"></i>
                        <span className="tooltip-text">Create</span>
                      </Link>
                    </li>
                    <li className="nav-item tooltip-container">
                      <Link className="nav-link" to="/admin">
                        <i className="navele fa-solid fa-user-tie"></i>
                        <span className="tooltip-text">Admin Dashboard</span>
                      </Link>
                    </li>
                    <li className="nav-item tooltip-container">
                      <Link
                        className="nav-link"
                        to="/tournaments/update-results"
                      >
                        <i className="navele fa-solid fa-pen-to-square"></i>
                        <span className="tooltip-text">Update Results</span>
                      </Link>
                    </li>
                  </>
                )}
              </>
            )}
            {isAuthenticated ? (
              <>
                <li className="nav-item dropdown" ref={dropdownRef}>
                  <button
                    className="btn-outline-light btn dropdown-toggle tooltip-container"
                    onClick={() => setOpen(!open)}
                  >
                    <i className="fa-regular fa-user"></i>{" "}
                    <span className="tooltip-text"> User Dropdown</span>
                  </button>
                  {open && (
                    <div className="dropdown-menu show-dropdown">
                      <ul>
                        <li>
                          <Link
                            className="dropdown-link"
                            to="/welcome"
                            onClick={() => setOpen(false)}
                          >
                            Welcome {user?.username}
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="dropdown-link"
                            to="/teams"
                            onClick={() => setOpen(false)}
                          >
                            My Teams
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="dropdown-link"
                            to="/teams/create"
                            onClick={() => setOpen(false)}
                          >
                            Create Team
                          </Link>
                        </li>
                        <li>
                          <button
                            className="dropdown-link logout-btn"
                            onClick={() => {
                              handleLogout();
                              setOpen(false);
                            }}
                          >
                            Logout{" "}
                            <i className="fa-solid fa-right-from-bracket"></i>
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login/Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
