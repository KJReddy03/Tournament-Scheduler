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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add validation
    if (
      !formData.name ||
      !formData.game ||
      !formData.startDate ||
      !formData.endDate
    ) {
      alert("Please fill all required fields");
      return;
    }
    try {
      await dispatch(
        createTournament({
          name: formData.name,
          game: formData.game,
          startDate: new Date(formData.startDate).toISOString(),
          endDate: new Date(formData.endDate).toISOString(),
          maxParticipants: parseInt(formData.maxParticipants) || 0,
        })
      );
      navigate("/tournaments");
    } catch (error) {
      console.error(
        "Create tournament failed:",
        error.response?.data || error.message
      );
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
                <div className="mb-3 form-row">
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
                <div className="mb-3 form-row">
                  <label htmlFor="game" className="form-label">
                    Game
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="game"
                    name="game"
                    value={formData.game}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="row mb-3 form-row">
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
                <div className="mb-3 form-row ">
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
