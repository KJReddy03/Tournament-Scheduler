import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { loadUser } from "./redux/actions/authActions";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from "./pages/Dashboard";
import TournamentDetails from "./components/tournament/TournamentDetails";
import CreateTournament from "./components/tournament/CreateTournament";
import UpdateResults from "./components/tournament/UpdateResults";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./components/admin/AdminDashboard";
import Welcome from "./pages/Welcome";
import AdminUpdateResults from "./components/admin/AdminUpdateResults";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/welcome"
            element={
              <PrivateRoute>
                <Welcome />
              </PrivateRoute>
            }
          />{" "}
          {/* Add this route */}
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/tournaments"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/tournaments/create"
            element={
              <PrivateRoute>
                <CreateTournament />
              </PrivateRoute>
            }
          />
          <Route
            path="/tournaments/:id"
            element={
              <PrivateRoute>
                <TournamentDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/tournaments/:id/update"
            element={
              <PrivateRoute>
                <UpdateResults />
              </PrivateRoute>
            }
          />
          <Route
            path="/tournaments/update-results"
            element={
              <PrivateRoute>
                <AdminUpdateResults />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
