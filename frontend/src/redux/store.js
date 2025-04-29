import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authReducer";
import tournamentReducer from "./reducers/tournamentReducer";
import adminReducer from "./reducers/adminReducer";
import teamReducer from "./reducers/teamReducer";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tournaments: tournamentReducer,
    admin: adminReducer,
    teams: teamReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});
