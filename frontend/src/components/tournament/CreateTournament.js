import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createTournament } from "../../redux/actions/tournamentActions";
import "./CreateTournament.css";

const CreateTournament = () => {
  const [formData, setFormData] = useState({
    name: "",
    game: "",
    startDate: "",
    endDate: "",
    maxParticipants: 0,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.tournaments);

  const gameOptions = [
    "Valorant",
    "CSGO",
    "FIFA",
    "Dota 2",
    "BGMI",
    "FallGuys",
    "Free Fire",
    "Pubg PC",
    "Apex Legends",
    "Call of Duty",
    "League of Legends",
    "Rocket League",
    "Clash Royale",
    "Clash of Clans",
    "Fortnite",
    "Brawlhalla",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, game, startDate, endDate, maxParticipants } = formData;

    if (!name || !game || !startDate || !endDate || !maxParticipants) {
      alert("Please fill all fields");
      return;
    }

    const data = new FormData();
    data.append("name", name);
    data.append("game", game);
    data.append("startDate", new Date(startDate).toISOString());
    data.append("endDate", new Date(endDate).toISOString());
    data.append("maxParticipants", maxParticipants);

    try {
      await dispatch(createTournament(data));
      navigate("/tournaments");
    } catch (error) {
      console.error("Create tournament failed:", error);
      alert(error?.response?.data?.message || "Tournament creation failed");
    }
  };

  return (
    <div className="page-container">
      <div className="create-tournament-form">
        <div className="container mt-5 col-md-8">
          <div className="card">
            <div className="card-header">
              <h2 className="text-center">Create New Tournament</h2>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Tournament Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="game" className="form-label">
                    Select Game
                  </label>
                  <select
                    className="form-control"
                    id="game"
                    name="game"
                    value={formData.game}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Select a Game --</option>
                    {gameOptions.map((game) => (
                      <option key={game} value={game}>
                        {game}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="startDate" className="form-label">
                      Start Date
                    </label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      id="startDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-7">
                    <label htmlFor="endDate" className="form-label">
                      End Date
                    </label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      id="endDate"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="maxParticipants" className="form-label">
                    Max Participants
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="maxParticipants"
                    name="maxParticipants"
                    min="2"
                    value={formData.maxParticipants}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Tournament"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTournament;
