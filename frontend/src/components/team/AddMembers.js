import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../redux/actions/adminActions";
import { addTeamMembers, fetchTeam } from "../../redux/actions/teamActions";
import "./AddMembers.css";

const AddMembers = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentTeam, loading: teamLoading } = useSelector(
    (state) => state.teams
  );
  const { users, loading: usersLoading } = useSelector((state) => state.admin);
  const { user } = useSelector((state) => state.auth);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    dispatch(fetchTeam(id));
    dispatch(fetchUsers());
  }, [dispatch, id]);

  const handleUserToggle = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addTeamMembers(id, { userIds: selectedUsers }));
      navigate(`/teams/${id}`);
    } catch (error) {
      console.error("Failed to add members:", error);
    }
  };

  if (teamLoading || usersLoading)
    return <div className="container mt-5">Loading...</div>;
  if (!currentTeam) return <div className="container mt-5">Team not found</div>;
  if (currentTeam.captainId !== user?.id) {
    return (
      <div className="container mt-5 alert alert-danger">
        Only the team captain can add members
      </div>
    );
  }

  // Filter out users who are already team members
  const availableUsers = users.filter(
    (user) =>
      !currentTeam.Users.some((member) => member.id === user.id) &&
      user.id !== currentTeam.captainId
  );

  return (
    <div className="add-members-container">
      <div className="container mt-5">
        <div className="card">
          <div className="card-header">
            <h2>Add Members to {currentTeam.name}</h2>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Select Members</label>
                {availableUsers.length > 0 ? (
                  <div className="user-list">
                    {availableUsers.map((user) => (
                      <div key={user.id} className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleUserToggle(user.id)}
                          id={`user-${user.id}`}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`user-${user.id}`}
                        >
                          {user.username} ({user.email})
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No available users to add</p>
                )}
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={selectedUsers.length === 0 || teamLoading}
              >
                {teamLoading ? "Adding..." : "Add Members"}
              </button>
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={() => navigate(`/teams/${id}`)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMembers;
