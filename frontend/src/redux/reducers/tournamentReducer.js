import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tournaments: [],
  currentTournament: null,
  loading: false,
  error: null,
  participants: [],
  joinStatus: null,
};

const tournamentSlice = createSlice({
  name: "tournaments",
  initialState,
  reducers: {
    fetchTournamentsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchTournamentsSuccess: (state, action) => {
      state.tournaments = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchTournamentsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchTournamentDetailsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchTournamentDetailsSuccess: (state, action) => {
      state.currentTournament = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchTournamentDetailsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    createTournamentStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createTournamentSuccess: (state, action) => {
      state.tournaments.push(action.payload);
      state.loading = false;
      state.error = null;
    },
    createTournamentFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    joinTournamentStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    joinTournamentSuccess: (state, action) => {
      if (state.currentTournament) {
        state.currentTournament.Participants =
          state.currentTournament.Participants || [];
        state.currentTournament.Participants.push(action.payload);
      }
      state.loading = false;
      state.error = null;
    },
    joinTournamentFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateResultsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateResultsSuccess: (state, action) => {
      if (state.currentTournament && state.currentTournament.Participants) {
        const index = state.currentTournament.Participants.findIndex(
          (p) => p.id === action.payload.id
        );
        if (index !== -1) {
          state.currentTournament.Participants[index] = action.payload;
        }
      }
      state.loading = false;
      state.error = null;
    },
    updateResultsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setJoinStatus: (state, action) => {
      state.joinStatus = action.payload;
    },
    clearJoinStatus: (state) => {
      state.joinStatus = null;
    },
    setParticipants: (state, action) => {
      state.participants = action.payload;
    },
  },
});

export const {
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
} = tournamentSlice.actions;

export default tournamentSlice.reducer;
