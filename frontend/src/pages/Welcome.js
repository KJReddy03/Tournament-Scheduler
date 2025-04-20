// src/pages/Welcome.js
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./Welcome.css";

const Welcome = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="welcome-container">
      <div className="welcome-card">
        <h1>Welcome, {user?.username}!</h1>
        <p className="lead">Unleash your competitive spirit!</p>
        <p className="desc">
          Whether you're a casual gamer or a hardcore e-sports enthusiast, this
          is your ultimate destination to join, create, and conquer gaming
          tournaments like never before.
        </p>
        <p className="can-do">🏁 What You Can Do Here:</p>
        <p className="do-desc">
          <li>🔓 Register or log in to access exclusive tournaments</li>
          <li>🎯 Explore upcoming gaming events across a variety of titles</li>
          <li>🕹️ Join tournaments and compete with players around the world</li>
          <li>🏆 Track scores, winners, and your gaming journey</li>
          <li>🛠️ Admins can easily create, manage, and monitor tournaments</li>
        </p>

        <div className="welcome-actions">
          <Link to="/tournaments" className="btn btn-primary btn-lg">
            View Tournaments
          </Link>
          {user?.role === "admin" && (
            <Link to="/admin" className="btn btn-primary btn-lg">
              Admin Dashboard
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Welcome;
