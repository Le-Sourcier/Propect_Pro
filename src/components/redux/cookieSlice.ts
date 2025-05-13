import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Définition du type pour l'état des cookies
export interface CookieState {
  necessary: boolean;
  marketing: boolean;
  statistics: boolean;
}

// État initial
const initialState: CookieState = {
  necessary: true, // Toujours activé
  marketing: false,
  statistics: false,
};

// Création du slice
const cookieSlice = createSlice({
  name: "cookies",
  initialState,
  reducers: {
    setCookiesPreferences: (state, action: PayloadAction<CookieState>) => {
      state.necessary = action.payload.necessary;
      state.marketing = action.payload.marketing;
      state.statistics = action.payload.statistics;
    },
    resetCookiesPreferences: (state) => {
      state.necessary = true;
      state.marketing = false;
      state.statistics = false;
    },
  },
});

// Exporter les actions
export const { setCookiesPreferences, resetCookiesPreferences } =
  cookieSlice.actions;

// Exporter le reducer
export default cookieSlice.reducer;
