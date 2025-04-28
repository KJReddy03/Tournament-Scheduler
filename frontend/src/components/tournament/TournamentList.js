import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import "./TournamentList.css";

const TournamentList = ({ tournaments }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef(null);

  const filteredTournaments = tournaments.filter((tournament) =>
    tournament.game?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const focusInput = () => {
    inputRef.current.focus();
  };

  return (
    <div className="tournament-list-container">
      <div className="search-bar mb-4">
        <div className="searchicon">
          <i className="fa-solid fa-magnifying-glass" onClick={focusInput}></i>
          <input
            ref={inputRef}
            className="search"
            type="text"
            placeholder="Search by game name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="row1">
        {filteredTournaments.length > 0 ? (
          filteredTournaments.map((tournament) => (
            <div key={tournament.id} className="data col-md-4 mb-4">
              <div className="card h-100">
                {tournament.image && (
                  <img
                    className="card-img-top"
                    src={`http://localhost:5000${tournament.image}`}
                    alt={tournament.name}
                    onError={(e) => {
                      e.target.src = "/images/default.jpg";
                    }}
                    style={{
                      height: "200px",
                      objectFit: "cover",
                      borderTopLeftRadius: "0.5rem",
                      borderTopRightRadius: "0.5rem",
                    }}
                  />
                )}
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
                    <strong>Participants:</strong> {tournament.participantCount}
                    /{tournament.maxParticipants}
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
          ))
        ) : (
          <p className="text-center">No tournaments found.</p>
        )}
      </div>
    </div>
  );
};

export default TournamentList;
