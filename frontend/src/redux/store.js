import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authReducer";
import tournamentReducer from "./reducers/tournamentReducer";
import adminReducer from "./reducers/adminReducer";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tournaments: tournamentReducer,
    admin: adminReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});
