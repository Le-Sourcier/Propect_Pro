import { configureStore } from "@reduxjs/toolkit";
import cookieReducer from "./cookieSlice";

// Créer le store avec le reducer de cookie
export const store = configureStore({
  reducer: {
    cookies: cookieReducer,
  },
});

// Définir le type du store pour l'utiliser dans toute l'application
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
