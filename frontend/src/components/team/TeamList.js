import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchUserTeams } from "../../redux/actions/teamActions";
import "./TeamList.css";

const TeamList = () => {
  const dispatch = useDispatch();
  const { userTeams, loading, error } = useSelector((state) => state.teams);

  useEffect(() => {
    dispatch(fetchUserTeams());
  }, [dispatch]);

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="my-teams">My Teams</h2>
        <Link to="/teams/create" className="create btn btn-primary">
          Create New Team
        </Link>
      </div>

      {loading && <p>Loading teams...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {userTeams.length > 0 ? (
        <div className="row">
          {userTeams.map((team) => (
            <div key={team.id} className="card-div">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{team.name}</h5>
                  <p className="card-text">
                    Captain: {team.captain?.username || "Unknown"}
                  </p>
                  <p className="card-text">
                    Members: {team.members?.length || 1}
                  </p>
                  <Link to={`/teams/${team.id}`} className="btn btn-primary">
                    View Team
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-info">
          You don't have any teams yet.{" "}
          <Link to="/teams/create">Create one</Link> to join tournaments as a
          team.
        </div>
      )}
    </div>
  );
};

export default TeamList;
