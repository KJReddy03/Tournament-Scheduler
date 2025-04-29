import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createTeam } from "../../redux/actions/teamActions";
import { fetchUsers } from "../../redux/actions/adminActions";

const CreateTeam = () => {
  const [name, setName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users } = useSelector((state) => state.admin);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

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
      await dispatch(createTeam({ name, userIds: selectedUsers }));
      navigate("/teams");
    } catch (error) {
      console.error("Team creation failed:", error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header">
          <h2>Create New Team</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Team Name</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Select Team Members</label>
              <div className="user-list">
                {users
                  .filter((u) => u.id !== user.id)
                  .map((user) => (
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
            </div>

            <button type="submit" className="btn btn-primary">
              Create Team
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTeam;
