import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTournamentDetails,
  joinTournament,
} from "../../redux/actions/tournamentActions";
import { joinTournamentAsTeam } from "../../redux/actions/teamActions";
import { fetchUserTeams } from "../../redux/actions/teamActions";
import "./TournamentDetails.css";

const TournamentDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentTournament, loading, error, joinStatus } = useSelector(
    (state) => state.tournaments
  );
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { userTeams, loading: teamsLoading } = useSelector(
    (state) => state.teams
  );

  const [joinAsTeam, setJoinAsTeam] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    dispatch(fetchTournamentDetails(id));
    if (isAuthenticated) {
      dispatch(fetchUserTeams());
    }
  }, [dispatch, id, isAuthenticated]);

  const handleJoin = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      await dispatch(joinTournament(id));
    } catch (error) {
      console.error("Join failed:", error);
    }
  };

  const handleTeamJoin = async () => {
    if (!selectedTeam) {
      alert("Please select a team first");
      return;
    }

    try {
      const result = await dispatch(joinTournamentAsTeam(selectedTeam, id));

      if (result.error) {
        alert(result.error.message || "Failed to join tournament");
        return;
      }

      alert("Successfully joined tournament as team!");
      // Refresh tournament data
      dispatch(fetchTournamentDetails(id));
    } catch (error) {
      console.error("Team join failed:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to join tournament. Please try again.";

      alert(errorMessage);

      if (error.response?.data?.error) {
        console.error("Server error details:", error.response.data.error);
      }
    }
  };

  const isParticipant = currentTournament?.Participants?.some(
    (p) =>
      p.userId === user?.id ||
      (p.teamId && userTeams.some((t) => t.id === p.teamId))
  );

  return (
    <div className="page-container">
      <div className="tournament-details">
        <div className="container mt-5">
          {loading && <p>Loading tournament details...</p>}
          {error && <div className="alert alert-danger">{error}</div>}
          {joinStatus === "success" && (
            <div className="alert alert-success">
              Successfully joined tournament!
            </div>
          )}
          {joinStatus === "error" && (
            <div className="alert alert-danger">Failed to join tournament</div>
          )}

          {currentTournament && (
            <div className="card">
              {currentTournament.image && (
                <img
                  src={`http://localhost:5000${currentTournament.image}`}
                  alt={currentTournament.name}
                  className="card-img-top"
                  style={{ maxHeight: "300px", objectFit: "cover" }}
                />
              )}
              <div className="card-header head">
                <h2>{currentTournament.name}</h2>
                <h5 className="text-muted">{currentTournament.game}</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-8">
                    <p>
                      <strong>Start Date:</strong>{" "}
                      {new Date(currentTournament.startDate).toLocaleString()}
                    </p>
                    <p>
                      <strong>End Date:</strong>{" "}
                      {new Date(currentTournament.endDate).toLocaleString()}
                    </p>
                    <p>
                      <strong>Max Participants:</strong>{" "}
                      {currentTournament.maxParticipants}
                    </p>
                    <p>
                      <strong>Status:</strong> {currentTournament.status}
                    </p>
                  </div>
                  <div className="col-md-8 join">
                    {isAuthenticated && !isParticipant && (
                      <div className="join-options">
                        <div className="form-check mb-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={joinAsTeam}
                            onChange={() => setJoinAsTeam(!joinAsTeam)}
                            id="joinAsTeam"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="joinAsTeam"
                          >
                            Join as a team
                          </label>
                        </div>

                        {joinAsTeam ? (
                          <div className="team-join">
                            {teamsLoading ? (
                              <p>Loading your teams...</p>
                            ) : userTeams?.length > 0 ? (
                              <>
                                <select
                                  className="form-select mb-3"
                                  value={selectedTeam || ""}
                                  onChange={(e) =>
                                    setSelectedTeam(e.target.value)
                                  }
                                >
                                  <option value="">Select a team</option>
                                  {userTeams.map((team) => (
                                    <option key={team.id} value={team.id}>
                                      {team.name} (Captain:{" "}
                                      {team.captain?.username || "You"})
                                    </option>
                                  ))}
                                </select>
                                <button
                                  onClick={handleTeamJoin}
                                  className="btn btn-primary"
                                  disabled={!selectedTeam || loading}
                                >
                                  {loading ? "Joining..." : "Join as Team"}
                                </button>
                              </>
                            ) : (
                              <div className="alert alert-info">
                                You don't have any teams.{" "}
                                <Link to="/teams/create">Create one</Link>{" "}
                                first.
                              </div>
                            )}
                            <Link
                              to="/teams/create"
                              className="btn btn-outline-secondary ms-2"
                            >
                              Create New Team
                            </Link>
                          </div>
                        ) : (
                          <button
                            onClick={handleJoin}
                            className="btn btn-primary"
                            disabled={loading}
                          >
                            {loading ? "Joining..." : "Join Tournament"}
                          </button>
                        )}
                      </div>
                    )}
                    {isParticipant && (
                      <div className="alert alert-info">
                        You're already registered for this tournament
                      </div>
                    )}
                  </div>
                </div>

                <h3 className="part">Participants</h3>
                <ul className="list-group">
                  {currentTournament.Participants?.length > 0 ? (
                    currentTournament.Participants.map((participant) => (
                      <li key={participant.id} className="list-group-item">
                        {participant.teamId ? (
                          <>
                            <span>Team: {participant.Team?.name} </span>
                            <span>
                              (Captain: {participant.Team?.captain?.username}){" "}
                            </span>
                          </>
                        ) : (
                          <>
                            <span>User: {participant.User?.username} </span>
                            <span>({participant.User?.email}) </span>
                          </>
                        )}
                        <span>Status: {participant.status} </span>
                        <span>Score: {participant.score}</span>
                      </li>
                    ))
                  ) : (
                    <li className="list-group-item">No participants yet</li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TournamentDetails;
