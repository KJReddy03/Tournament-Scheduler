import axios from "axios";
import {
  fetchUsersStart,
  fetchUsersSuccess,
  fetchUsersFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
} from "../reducers/adminReducer";
import { loginSuccess, logout } from "../reducers/authReducer";

const API_URL = process.env.REACT_APP_API_URL;

export const fetchUsers = () => async (dispatch, getState) => {
  try {
    const { token } = getState().auth;
    dispatch(fetchUsersStart());
    const response = await axios.get(`${API_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch(fetchUsersSuccess(response.data));
  } catch (error) {
    dispatch(fetchUsersFailure(error.message));
  }
};

export const deleteUser = (userId) => async (dispatch, getState) => {
  try {
    const { token } = getState().auth;
    dispatch(deleteUserStart());

    await axios.delete(`${API_URL}/admin/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    dispatch(deleteUserSuccess(userId));
    return true;
  } catch (error) {
    dispatch(deleteUserFailure(error.message));
    return false;
  }
};

export const deleteTournament =
  (tournamentId) => async (dispatch, getState) => {
    try {
      const { token } = getState().auth;
      dispatch({ type: "DELETE_TOURNAMENT_START" });

      await axios.delete(`${API_URL}/admin/tournaments/${tournamentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch({ type: "DELETE_TOURNAMENT_SUCCESS", payload: tournamentId });
      return true;
    } catch (error) {
      dispatch({ type: "DELETE_TOURNAMENT_FAILURE", payload: error.message });
      return false;
    }
  };

export const loadUser = () => (dispatch) => {
  try {
    const profile = JSON.parse(localStorage.getItem("profile"));
    if (profile?.token) {
      // Just check if token exists (no expiration check)
      dispatch(loginSuccess(profile));
    }
  } catch (error) {
    console.error("Failed to load user:", error);
    localStorage.removeItem("profile");
    dispatch(logout());
  }
};

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem("profile");
  dispatch(logout());
};
