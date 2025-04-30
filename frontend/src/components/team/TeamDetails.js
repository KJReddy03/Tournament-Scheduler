import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeam } from "../../redux/actions/teamActions";
import { Link } from "react-router-dom";
import { disbandTeam, removeTeamMember } from "../../redux/actions/teamActions";
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

  const handleRemoveMember = async (memberId) => {
    if (
      window.confirm(
        "Are you sure you want to remove this member from the team?"
      )
    ) {
      try {
        await dispatch(removeTeamMember(id, memberId));
        // Refresh team data after removal
        await dispatch(fetchTeam(id));
      } catch (error) {
        console.error("Failed to remove member:", error);
        alert(`Failed to remove member: ${error.message}`);
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

  return (
    <div className="team-details-container">
      <div>
        <div className="team-header">
          <h2>{currentTeam.name}</h2>
          <p className="team-id">
            Team ID: {currentTeam.id} | Created:{" "}
            {new Date(currentTeam.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="team-content">
          <div className="team-section">
            <div className="">
              <h4>Team Captain</h4>
              <div className="">
                <div className="captain-card">
                  <h5 className="">{currentTeam.captain?.username}</h5>
                  <p className="">{currentTeam.captain?.email}</p>
                </div>
              </div>
            </div>

            <div className="">
              <h4>Team Members</h4>
              {allMembers.length > 0 ? (
                <ul className="member-list">
                  {allMembers.map((member) => (
                    <li key={member.id} className="member-item">
                      <span className="member-name">{member.username}</span>
                      <br />
                      <span className="member-email">{member.email}</span>

                      {member.id === currentTeam.captainId ? (
                        <span className="captain-badge">Captain</span>
                      ) : (
                        user?.id === currentTeam.captainId && (
                          <button
                            className="remove action-buttons"
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
          </div>

          {/* Team management for captain */}
          {user?.id === currentTeam.captainId && (
            <div className="team-actions">
              <h4>Team Management</h4>
              <div className="">
                <Link to={`/teams/${id}/edit`} className="action-buttons">
                  <i className="fas fa-edit me-2"></i>Edit Team
                </Link>
                <Link
                  to={`/teams/${id}/add-members`}
                  className="action-buttons"
                >
                  <i className="fas fa-user-plus me-2"></i>Add Members
                </Link>
                <Link className="action-buttons" onClick={handleDisbandTeam}>
                  <i className="fas fa-trash-alt me-2"></i>Disband Team
                </Link>
              </div>
            </div>
          )}

          {/*Tournaments this team has joined */}
          <div className="tournament-list">
            <h4>Tournaments</h4>
            {currentTeam.participants?.length > 0 ? (
              <div className="tournament-item">
                {currentTeam.participants.map((participant) => (
                  <Link
                    key={participant.id}
                    to={`/tournaments/${participant.tournament.id}`}
                    className=""
                  >
                    <div className="tournament-item">
                      <div>
                        <strong>{participant.tournament.name}</strong>
                        <br />
                        <small className="tournament-item">
                          {participant.tournament.game} |{" "}
                          {new Date(
                            participant.tournament.startDate
                          ).toLocaleDateString()}
                        </small>
                      </div>
                      <span
                        className={`badge ${
                          participant.status === "winner"
                            ? "status-winner"
                            : participant.status === "eliminated"
                            ? "status-eliminated"
                            : "status-active"
                        }`}
                      >
                        {participant.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="tournament-item">
                This team hasn't joined any tournaments yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDetails;
