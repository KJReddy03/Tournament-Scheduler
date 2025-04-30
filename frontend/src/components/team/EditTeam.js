import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateTeam, fetchTeam } from "../../redux/actions/teamActions";
import "./EditTeam.css";

const EditTeam = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentTeam, loading, error } = useSelector((state) => state.teams);
  const { user } = useSelector((state) => state.auth);
  const [name, setName] = useState("");

  useEffect(() => {
    dispatch(fetchTeam(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (currentTeam) {
      setName(currentTeam.name);
    }
  }, [currentTeam]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateTeam(id, { name }));
      navigate(`/teams/${id}`);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  if (loading) return <div className="container mt-5">Loading...</div>;
  if (error)
    return <div className="container mt-5 alert alert-danger">{error}</div>;
  if (!currentTeam) return <div className="container mt-5">Team not found</div>;
  if (currentTeam.captainId !== user?.id) {
    return (
      <div className="container mt-5 alert alert-danger">
        Only the team captain can edit this team
      </div>
    );
  }

  return (
    <div className="edit-team-container">
      <div className="container mt-5">
        <div className="card">
          <div className="card-header">
            <h2 className="h2">Edit Team</h2>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Team Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="add btn btn-primary"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Team"}
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

export default EditTeam;
