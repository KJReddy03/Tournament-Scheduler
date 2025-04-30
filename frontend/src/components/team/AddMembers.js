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
      const result = await dispatch(
        addTeamMembers(id, { userIds: selectedUsers })
      );

      // If successful, navigate to team details
      if (result) {
        navigate(`/teams/${id}`);
      }
    } catch (error) {
      console.error("Add members error:", error);
      // Optionally show a user-friendly error message
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

  // Safely filter out users who are already team members
  const availableUsers =
    users?.filter((userItem) => {
      // Check if user is not the captain and not already a member
      return (
        userItem.id !== currentTeam.captainId &&
        !(currentTeam.members || []).some((member) => member.id === userItem.id)
      );
    }) || [];

  return (
    <div className="add-members-container">
      <div className="container mt-5">
        <div className="card">
          <div className="card-header">
            <h2 className="h2">Add Members to {currentTeam.name}</h2>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Select Members</label>
                {availableUsers.length > 0 ? (
                  <div className="user-list">
                    {availableUsers.map((userItem) => (
                      <div key={userItem.id} className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={selectedUsers.includes(userItem.id)}
                          onChange={() => handleUserToggle(userItem.id)}
                          id={`user-${userItem.id}`}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`user-${userItem.id}`}
                        >
                          {userItem.username} ({userItem.email})
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="form-che-label">No available users to add</p>
                )}
              </div>
              <button
                type="submit"
                className="add btn btn-primary"
                disabled={selectedUsers.length === 0 || teamLoading}
              >
                {teamLoading ? "Adding..." : "Add Members"}
              </button>
              <button
                type="button"
                className="add btn btn-primary ms-2"
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
