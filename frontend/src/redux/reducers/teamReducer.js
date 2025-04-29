import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  teams: [],
  userTeams: [],
  currentTeam: null,
  loading: false,
  error: null,
  joinStatus: null,
};

const teamSlice = createSlice({
  name: "teams",
  initialState,
  reducers: {
    // Existing reducers
    fetchUserTeamsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchUserTeamsSuccess: (state, action) => {
      state.userTeams = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchUserTeamsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    createTeamStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createTeamSuccess: (state, action) => {
      state.teams.push(action.payload);
      state.userTeams.push(action.payload); // Add to userTeams as well
      state.loading = false;
      state.error = null;
    },
    createTeamFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchTeamStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchTeamSuccess: (state, action) => {
      state.currentTeam = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchTeamFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    joinTournamentStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    joinTournamentSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      // Update current team if it's the one that joined
      if (state.currentTeam) {
        state.currentTeam.Participants = state.currentTeam.Participants || [];
        state.currentTeam.Participants.push(action.payload);
      }
    },
    joinTournamentFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // New reducers for additional functionality
    updateTeamStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateTeamSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      // Update in teams array
      state.teams = state.teams.map((team) =>
        team.id === action.payload.id ? action.payload : team
      );
      // Update in userTeams array
      state.userTeams = state.userTeams.map((team) =>
        team.id === action.payload.id ? action.payload : team
      );
      // Update currentTeam if it's the one being edited
      if (state.currentTeam && state.currentTeam.id === action.payload.id) {
        state.currentTeam = action.payload;
      }
    },
    updateTeamFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addTeamMembersStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    addTeamMembersSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      // Update currentTeam if it's the one being modified
      if (state.currentTeam && state.currentTeam.id === action.payload.id) {
        state.currentTeam = action.payload;
      }
      // Update in teams array
      state.teams = state.teams.map((team) =>
        team.id === action.payload.id ? action.payload : team
      );
      // Update in userTeams array
      state.userTeams = state.userTeams.map((team) =>
        team.id === action.payload.id ? action.payload : team
      );
    },
    addTeamMembersFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    disbandTeamStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    disbandTeamSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      // Remove from teams array
      state.teams = state.teams.filter((team) => team.id !== action.payload);
      // Remove from userTeams array
      state.userTeams = state.userTeams.filter(
        (team) => team.id !== action.payload
      );
      // Clear currentTeam if it's the one being disbanded
      if (state.currentTeam && state.currentTeam.id === action.payload) {
        state.currentTeam = null;
      }
    },
    disbandTeamFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    removeTeamMemberStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    removeTeamMemberSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      const { teamId, userId } = action.payload;
      // Update currentTeam if it's the one being modified
      if (state.currentTeam && state.currentTeam.id === teamId) {
        state.currentTeam.Users = state.currentTeam.Users.filter(
          (user) => user.id !== userId
        );
      }
      // Update in teams array
      state.teams = state.teams.map((team) => {
        if (team.id === teamId) {
          return {
            ...team,
            Users: team.Users.filter((user) => user.id !== userId),
          };
        }
        return team;
      });
      // Update in userTeams array
      state.userTeams = state.userTeams.map((team) => {
        if (team.id === teamId) {
          return {
            ...team,
            Users: team.Users.filter((user) => user.id !== userId),
          };
        }
        return team;
      });
    },
    removeTeamMemberFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

// Export all actions
export const {
  fetchUserTeamsStart,
  fetchUserTeamsSuccess,
  fetchUserTeamsFailure,
  createTeamStart,
  createTeamSuccess,
  createTeamFailure,
  fetchTeamStart,
  fetchTeamSuccess,
  fetchTeamFailure,
  joinTournamentStart,
  joinTournamentSuccess,
  joinTournamentFailure,
  updateTeamStart,
  updateTeamSuccess,
  updateTeamFailure,
  addTeamMembersStart,
  addTeamMembersSuccess,
  addTeamMembersFailure,
  disbandTeamStart,
  disbandTeamSuccess,
  disbandTeamFailure,
  removeTeamMemberStart,
  removeTeamMemberSuccess,
  removeTeamMemberFailure,
} = teamSlice.actions;

export default teamSlice.reducer;
