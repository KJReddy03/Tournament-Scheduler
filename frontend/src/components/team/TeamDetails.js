import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeam, removeTeamMember } from "../../redux/actions/teamActions";
import { Link } from "react-router-dom";
import { disbandTeam } from "../../redux/actions/teamActions";
import "./TeamDetails.css";

const TeamDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentTeam, loading, error } = useSelector((state) => state.teams);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchTeam(id));
      } catch (error) {
        console.error("Failed to fetch team:", error);
      }
    };
    fetchData();
  }, [dispatch, id]);

  const handleDisbandTeam = async () => {
    if (
      window.confirm(
        "Are you sure you want to disband this team? This action cannot be undone."
      )
    ) {
      try {
        await dispatch(disbandTeam(id));
        navigate("/teams");
      } catch (error) {
        console.error("Failed to disband team:", error);
        alert(`Failed to disband team: ${error.message}`);
      }
    }
  };

  if (loading)
    return <div className="container mt-5">Loading team details...</div>;
  if (error)
    return <div className="container mt-5 alert alert-danger">{error}</div>;
  if (!currentTeam) return <div className="container mt-5">Team not found</div>;

  // Combine captain and members for display
  const allMembers = currentTeam.members ? [...currentTeam.members] : [];

  // Add captain if not already in members
  if (
    currentTeam.captain &&
    !allMembers.some((m) => m.id === currentTeam.captain.id)
  ) {
    allMembers.unshift(currentTeam.captain);
  }
  const handleRemoveMember = async () => {
    if (
      window.confirm(
        "Are you sure you want to disband this team? This action cannot be undone."
      )
    ) {
      try {
        await dispatch(removeTeamMember(id));
        navigate("/teams");
      } catch (error) {
        console.error("Failed to disband team:", error);
        alert(`Failed to disband team: ${error.message}`);
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header">
          <h2>{currentTeam.name}</h2>
          <p className="text-muted">
            Team ID: {currentTeam.id} | Created:{" "}
            {new Date(currentTeam.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <h4>Team Members</h4>
              {allMembers.length > 0 ? (
                <ul className="list-group">
                  {allMembers.map((member) => (
                    <li
                      key={member.id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <strong>{member.username}</strong>
                        <br />
                        <small>{member.email}</small>
                      </div>
                      {member.id === currentTeam.captainId ? (
                        <span className="badge bg-primary">Captain</span>
                      ) : (
                        user?.id === currentTeam.captainId && (
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleRemoveMember(member.id)}
                          >
                            Remove
                          </button>
                        )
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No members in this team yet.</p>
              )}
            </div>

            <div className="col-md-6">
              <h4>Tournaments</h4>
              {currentTeam.participants?.length > 0 ? (
                <div className="list-group">
                  {currentTeam.participants.map((participant) => (
                    <Link
                      key={participant.id}
                      to={`/tournaments/${participant.tournament.id}`}
                      className="list-group-item list-group-item-action"
                    >
                      <div className="d-flex justify-content-between">
                        <div>
                          <strong>{participant.tournament.name}</strong>
                          <br />
                          <small className="text-muted">
                            {participant.tournament.game} |{" "}
                            {new Date(
                              participant.tournament.startDate
                            ).toLocaleDateString()}
                          </small>
                        </div>
                        <span
                          className={`badge ${
                            participant.status === "winner"
                              ? "bg-success"
                              : participant.status === "eliminated"
                              ? "bg-danger"
                              : "bg-secondary"
                          }`}
                        >
                          {participant.status}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p>This team hasn't joined any tournaments yet.</p>
              )}
            </div>
          </div>

          {/* Team management for captain */}
          {user?.id === currentTeam.captainId && (
            <div className="mt-4">
              <h4>Team Management</h4>
              <div className="d-flex gap-2 flex-wrap">
                <Link to={`/teams/${id}/edit`} className="btn btn-primary">
                  <i className="fas fa-edit me-2"></i>Edit Team
                </Link>
                <Link
                  to={`/teams/${id}/add-members`}
                  className="btn btn-success"
                >
                  <i className="fas fa-user-plus me-2"></i>Add Members
                </Link>
                <button className="btn btn-danger" onClick={handleDisbandTeam}>
                  <i className="fas fa-trash-alt me-2"></i>Disband Team
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamDetails;
