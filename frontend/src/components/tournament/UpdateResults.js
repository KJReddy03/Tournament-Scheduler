import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTournamentDetails,
  updateParticipantResults,
} from "../../redux/actions/tournamentActions";
import "./UpdateResults.css";

const UpdateResults = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formRef = useRef(null);
  const { currentTournament, loading, error } = useSelector(
    (state) => state.tournaments
  );
  const { user } = useSelector((state) => state.auth);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [updateData, setUpdateData] = useState({
    status: "registered",
    score: 0,
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        formRef.current &&
        !formRef.current.contains(event.target) &&
        selectedParticipant
      ) {
        setSelectedParticipant(null); // close the form
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedParticipant]);

  useEffect(() => {
    dispatch(fetchTournamentDetails(id));
  }, [dispatch, id]);

  // Check admin access
  if (user?.role !== "admin") {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          Admin access required. Please log in as an administrator.
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(
        updateParticipantResults(id, selectedParticipant, updateData)
      );
      alert("Results updated successfully");
      setSelectedParticipant(null); // ✅ close the form after submit
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <div className="page-container">
      <div className="container mt-5">
        <h2 className="result">Update Tournament Results</h2>
        <Link to={`/tournaments/${id}`} className="btn btn-primary">
          Back to Tournament
        </Link>

        {loading && <p>Loading...</p>}
        {error && <div className="alert alert-danger">{error}</div>}

        {currentTournament && (
          <div className="row">
            <div className="col-md-6">
              <h4>Select Participant</h4>
              <ul className="list-group">
                {currentTournament.participants?.length > 0 ? (
                  currentTournament.participants?.map((participant) => (
                    <li
                      key={participant.id}
                      className={`list-group-item ${
                        selectedParticipant === participant.id ? "active" : ""
                      }`}
                      onClick={() => {
                        setSelectedParticipant(participant.id);
                        setUpdateData({
                          status: participant.status,
                          score: participant.score,
                        });
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      {participant.userId?.username} - Status:{" "}
                      {participant.status} - Score: {participant.score}
                    </li>
                  ))
                ) : (
                  <span>NO Participants Joined</span>
                )}
              </ul>
            </div>

            <div className="col-md-6 div-ele">
              {selectedParticipant && (
                //from to update results
                <form
                  onSubmit={handleSubmit}
                  className="result-form"
                  ref={formRef}
                >
                  <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select"
                      value={updateData.status}
                      onChange={(e) =>
                        setUpdateData({ ...updateData, status: e.target.value })
                      }
                    >
                      <option value="registered">Registered</option>
                      <option value="active">Active</option>
                      <option value="eliminated">Eliminated</option>
                      <option value="winner">Winner</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Score</label>
                    <input
                      type="number"
                      className="form-control"
                      value={updateData.score}
                      onChange={(e) =>
                        setUpdateData({
                          ...updateData,
                          score: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Update Results
                  </button>
                </form>
                //ends here
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateResults;
