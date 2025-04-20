import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchUsers,
  deleteUser,
  deleteTournament,
} from "../../redux/actions/adminActions";
import { fetchTournaments } from "../../redux/actions/tournamentActions";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.admin);
  const { tournaments } = useSelector((state) => state.tournaments);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemType, setItemType] = useState("");
  const [activeTab, setActiveTab] = useState("users");

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchTournaments());
  }, [dispatch]);

  const handleDelete = (type, id) => {
    setItemType(type);
    setSelectedItem(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      if (itemType === "user") {
        await dispatch(deleteUser(selectedItem));
        dispatch(fetchUsers());
      } else if (itemType === "tournament") {
        await dispatch(deleteTournament(selectedItem));
        dispatch(fetchTournaments());
      }
    } catch (error) {
      console.error("Deletion failed:", error);
    } finally {
      setShowConfirm(false);
    }
  };

  return (
    <div className="admin-container">
      <h2 className="dashboard-title">Admin Dashboard</h2>

      <div className="tab-buttons">
        <button
          className={`tab-button ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          Users
        </button>
        <button
          className={`tab-button ${
            activeTab === "tournaments" ? "active" : ""
          }`}
          onClick={() => setActiveTab("tournaments")}
        >
          Tournaments
        </button>
      </div>

      {activeTab === "users" && (
        <div className="tab-content">
          {loading ? (
            <p>Loading users...</p>
          ) : error ? (
            <div className="error-box">{error}</div>
          ) : (
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete("user", user.id)}
                        disabled={user.role === "admin"}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === "tournaments" && (
        <div className="tab-content">
          <div className="admin-actions">
            <Link
              to="/tournaments/update-results"
              className="btn btn-primary update-results-btn"
            >
              Update Tournament Results
            </Link>
          </div>
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Game</th>
                <th>Start Date</th>
                <th>Participants</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tournaments.map((tournament) => (
                <tr key={tournament.id}>
                  <td>{tournament.id}</td>
                  <td>{tournament.name}</td>
                  <td>{tournament.game}</td>
                  <td>{new Date(tournament.startDate).toLocaleString()}</td>
                  <td>
                    {tournament.participantCount}/{tournament.maxParticipants}
                  </td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete("tournament", tournament.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this {itemType}?</p>
            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button className="confirm-btn" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
