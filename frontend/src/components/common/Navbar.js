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
            <li className="nav-item">
              <Link className="nav-link" to="/">
                <i className="fa-solid fa-house"></i>
              </Link>
            </li>
            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/tournaments">
                    Tournaments
                  </Link>
                </li>
                {user?.role === "admin" && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/tournaments/create">
                        Create
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin">
                        Admin Dashboard
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className="nav-link"
                        to="/tournaments/update-results"
                      >
                        Update Results
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
                    className="btn-outline-light btn dropdown-toggle"
                    onClick={() => setOpen(!open)}
                  >
                    <i className="fa-regular fa-user"></i>{" "}
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
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
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
