import axios from "axios";
import {
  fetchTournamentsStart,
  fetchTournamentsSuccess,
  fetchTournamentsFailure,
  fetchTournamentDetailsStart,
  fetchTournamentDetailsSuccess,
  fetchTournamentDetailsFailure,
  createTournamentStart,
  createTournamentSuccess,
  createTournamentFailure,
  joinTournamentStart,
  joinTournamentSuccess,
  joinTournamentFailure,
  updateResultsStart,
  updateResultsSuccess,
  updateResultsFailure,
  setJoinStatus,
  clearJoinStatus,
  setParticipants,
} from "../reducers/tournamentReducer";

const API_URL = process.env.REACT_APP_API_URL + "/tournaments";

export const fetchTournaments = () => async (dispatch) => {
  try {
    dispatch(fetchTournamentsStart());
    const response = await axios.get(API_URL);
    dispatch(fetchTournamentsSuccess(response.data));
  } catch (error) {
    dispatch(fetchTournamentsFailure(error.message));
  }
};

export const fetchTournamentDetails = (id) => async (dispatch) => {
  try {
    dispatch(fetchTournamentDetailsStart());
    const response = await axios.get(`${API_URL}/${id}`);
    dispatch(fetchTournamentDetailsSuccess(response.data));
  } catch (error) {
    dispatch(fetchTournamentDetailsFailure(error.message));
  }
};

export const createTournament =
  (tournamentData) => async (dispatch, getState) => {
    try {
      const { token } = getState().auth;
      dispatch(createTournamentStart());
      const response = await axios.post(`${API_URL}`, tournamentData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(createTournamentSuccess(response.data));
      return response.data;
    } catch (error) {
      dispatch(
        createTournamentFailure(error.response?.data?.message || error.message)
      );
      throw error;
    }
  };

export const joinTournament = (tournamentId) => async (dispatch, getState) => {
  try {
    const { token } = getState().auth;
    dispatch(joinTournamentStart());

    console.log("Sending token:", token);
    const response = await axios.post(
      `${API_URL}/${tournamentId}/join`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    dispatch(joinTournamentSuccess(response.data));
    dispatch(setJoinStatus("success"));
    setTimeout(() => dispatch(clearJoinStatus()), 3000);
    return response.data;
  } catch (error) {
    dispatch(
      joinTournamentFailure(error.response?.data?.message || error.message)
    );
    dispatch(setJoinStatus("error"));
    setTimeout(() => dispatch(clearJoinStatus()), 3000);
    throw error;
  }
};

export const fetchParticipants = (tournamentId) => async (dispatch) => {
  try {
    const response = await axios.get(`${API_URL}/${tournamentId}/participants`);
    dispatch(setParticipants(response.data));
  } catch (error) {
    console.error("Error fetching participants:", error);
  }
};

export const updateParticipantResults =
  (tournamentId, participantId, updateData) => async (dispatch, getState) => {
    try {
      const { token } = getState().auth;
      dispatch(updateResultsStart());
      const response = await axios.put(
        `${API_URL}/${tournamentId}/participants/${participantId}`,
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(updateResultsSuccess(response.data));
      return response.data;
    } catch (error) {
      dispatch(
        updateResultsFailure(error.response?.data?.message || error.message)
      );
      throw error;
    }
  };
