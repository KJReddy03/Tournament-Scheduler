import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTournamentDetails,
  joinTournament,
} from "../../redux/actions/tournamentActions";
import "./TournamentDetails.css";

const TournamentDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentTournament, loading, error, joinStatus } = useSelector(
    (state) => state.tournaments
  );
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchTournamentDetails(id));
  }, [dispatch, id]);

  const handleJoin = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      await dispatch(joinTournament(id));
      console.log("attempt failed");
    } catch (error) {
      console.error("Join failed:", error);
    }
  };

  const isParticipant = currentTournament?.Participants?.some(
    (p) => p.userId === user?.id
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
                      <button
                        onClick={handleJoin}
                        className="btn btn-primary"
                        disabled={loading}
                      >
                        Join Tournament
                      </button>
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
                  {currentTournament.Participants?.map((participant) => (
                    <li key={participant.id} className="list-group-item ">
                      <span>User ID: {participant.userId} </span>
                      <span>UserName: {participant.User?.username} </span>
                      <span>Status: {participant.status} </span>
                      <span>Score: {participant.score}</span>
                    </li>
                  ))}
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
