import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTournaments } from "../../redux/actions/tournamentActions";
import { Link } from "react-router-dom";

const AdminUpdateResults = () => {
  const dispatch = useDispatch();
  const { tournaments } = useSelector((state) => state.tournaments);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchTournaments());
  }, [dispatch]);

  // Verify admin role
  if (user?.role !== "admin") {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">Admin access required</div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2>Admin - Update Tournament Results</h2>
      <div className="list-group">
        {tournaments.map((tournament) => (
          <Link
            key={tournament.id}
            to={`/tournaments/${tournament.id}/update`}
            className="list-group-item list-group-item-action one"
          >
            {tournament.name} ({tournament.game})
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminUpdateResults;
