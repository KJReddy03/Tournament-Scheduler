import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="container mt-5">
      <div className="hexa jumbotron text-center">
        <h1 className="display-4">Welcome to Tournament Scheduler</h1>
        <p className="lead">
          Organize and participate in gaming tournaments with ease
        </p>
        <hr className="my-4" />
        {isAuthenticated ? (
          <Link className="btn btn-primary btn-lg" to="/tournaments">
            View Tournaments
          </Link>
        ) : (
          <div className="butns">
            <Link className="tns btn btn-primary btn-lg mr-3" to="/login">
              Login
            </Link>
            <Link className="tns btn btn-primary btn-lg" to="/register">
              Register
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
