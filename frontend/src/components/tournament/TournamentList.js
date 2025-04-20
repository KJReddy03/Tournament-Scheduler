import React from "react";
import { Link } from "react-router-dom";
import "./TournamentList.css";

const TournamentList = ({ tournaments }) => {
  return (
    <div className="tournament-list-container">
      <div className="row">
        {tournaments.map((tournament) => (
          <div key={tournament.id} className="data col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h2 className="card-title">{tournament.name}</h2>
                <h4 className="card-subtitle mb-2 text-muted">
                  {tournament.game}
                </h4>
                <p className="card-text">
                  <strong>Date:</strong>{" "}
                  {new Date(tournament.startDate).toLocaleDateString()}
                </p>
                <p className="card-text">
                  <strong>Participants:</strong> {tournament.participantCount}/
                  {tournament.maxParticipants}
                </p>
                <div className="view-details">
                  <Link
                    to={`/tournaments/${tournament.id}`}
                    className="btn btn-outline-primary"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TournamentList;
