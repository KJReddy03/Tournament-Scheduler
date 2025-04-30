import axios from "axios";
import {
  createTeamStart,
  createTeamSuccess,
  createTeamFailure,
  fetchTeamStart,
  fetchTeamSuccess,
  fetchTeamFailure,
  joinTournamentStart,
  joinTournamentSuccess,
  joinTournamentFailure,
  fetchUserTeamsStart,
  fetchUserTeamsSuccess,
  fetchUserTeamsFailure,
  updateTeamStart,
  updateTeamSuccess,
  updateTeamFailure,
  addTeamMembersStart,
  addTeamMembersSuccess,
  addTeamMembersFailure,
  disbandTeamStart,
  disbandTeamSuccess,
  disbandTeamFailure,
  // removeTeamMemberStart,
  // removeTeamMemberSuccess,
  // removeTeamMemberFailure,
} from "../reducers/teamReducer";

const API_URL = process.env.REACT_APP_API_URL + "/teams";

export const createTeam = (teamData) => async (dispatch, getState) => {
  try {
    const { token } = getState().auth;
    dispatch(createTeamStart());
    const response = await axios.post(API_URL, teamData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch(createTeamSuccess(response.data));
    return response.data;
  } catch (error) {
    dispatch(createTeamFailure(error.response?.data?.message || error.message));
    throw error;
  }
};

export const fetchTeam = (teamId) => async (dispatch, getState) => {
  try {
    const { token } = getState().auth;
    dispatch(fetchTeamStart());

    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/teams/${teamId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 10000, // 10 second timeout
      }
    );

    if (response.data.success) {
      dispatch(fetchTeamSuccess(response.data.data));
    } else {
      throw new Error(response.data.message || "Failed to fetch team");
    }
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch team details";

    console.error("fetchTeam error:", errorMessage, error.response?.data);

    dispatch(fetchTeamFailure(errorMessage));

    // Return null for 404 errors
    if (error.response?.status === 404) {
      return null;
    }

    // You might want to show a toast notification here
    // toast.error(errorMessage);
  }
};

export const joinTournamentAsTeam =
  (teamId, tournamentId) => async (dispatch, getState) => {
    try {
      const { token } = getState().auth;
      dispatch(joinTournamentStart());
      const response = await axios.post(
        `${API_URL}/${teamId}/tournaments/${tournamentId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(joinTournamentSuccess(response.data));
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to join tournament";
      dispatch(joinTournamentFailure(errorMessage));
      throw error;
    }
  };

export const fetchUserTeams = () => async (dispatch, getState) => {
  try {
    const { token } = getState().auth;
    dispatch(fetchUserTeamsStart());

    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/teams/user/my-teams`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    dispatch(fetchUserTeamsSuccess(response.data));
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "Failed to fetch teams";
    console.error("fetchUserTeams error:", errorMessage);
    dispatch(fetchUserTeamsFailure(errorMessage));

    // If it's a 404, return empty array instead of error
    if (error.response?.status === 404) {
      dispatch(fetchUserTeamsSuccess([]));
    }
  }
};

export const updateTeam = (teamId, teamData) => async (dispatch, getState) => {
  try {
    const { token } = getState().auth;
    dispatch(updateTeamStart());
    const response = await axios.put(`${API_URL}/${teamId}`, teamData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch(updateTeamSuccess(response.data));
    return response.data;
  } catch (error) {
    dispatch(updateTeamFailure(error.response?.data?.message || error.message));
    throw error;
  }
};

export const addTeamMembers =
  (teamId, { userIds }) =>
  async (dispatch, getState) => {
    try {
      const { token } = getState().auth;
      dispatch(addTeamMembersStart());

      const response = await axios.post(
        `${API_URL}/${teamId}/members`,
        { userIds }, // Make sure this matches backend expectation
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Dispatch success with the updated team data
      dispatch(addTeamMembersSuccess(response.data));

      // Return the complete response for component to handle
      return response.data;
    } catch (error) {
      // More detailed error handling
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to add members";
      dispatch(addTeamMembersFailure(errorMessage));
      throw error;
    }
  };

export const disbandTeam = (teamId) => async (dispatch, getState) => {
  try {
    const { token } = getState().auth;
    dispatch(disbandTeamStart());

    await axios.delete(`${process.env.REACT_APP_API_URL}/teams/${teamId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    dispatch(disbandTeamSuccess(teamId));
  } catch (error) {
    console.error("Failed to disband team:", error);
    dispatch(
      disbandTeamFailure(error.response?.data?.message || error.message)
    );
    throw error;
  }
};

export const removeTeamMember =
  (teamId, userId) => async (dispatch, getState) => {
    try {
      const { token } = getState().auth;
      dispatch({ type: "REMOVE_TEAM_MEMBER_START" });

      await axios.delete(
        `${process.env.REACT_APP_API_URL}/teams/${teamId}/members/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch({
        type: "REMOVE_TEAM_MEMBER_SUCCESS",
        payload: { teamId, userId },
      });
      return true;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to remove team member";
      dispatch({ type: "REMOVE_TEAM_MEMBER_FAILURE", payload: errorMessage });
      throw error;
    }
  };
