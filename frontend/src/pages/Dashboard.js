import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchTournaments } from "../redux/actions/tournamentActions";
import TournamentList from "../components/tournament/TournamentList";
import "./Dashboard.css";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { tournaments, loading, error } = useSelector(
    (state) => state.tournaments
  );
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchTournaments());
  }, [dispatch]);

  return (
    <div className="page-container">
      <div className="dashboard-content">
        <div className="container elem">
          <h2 className="head-cont">Tournaments</h2>
          {user && (
            <Link
              to="/tournaments/create"
              className="btn btn-primary head-cont"
            >
              Create Tournament
            </Link>
          )}
        </div>

        {loading && <div className="text-center">Loading tournaments...</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && !error && <TournamentList tournaments={tournaments} />}
      </div>
    </div>
  );
};

export default Dashboard;
