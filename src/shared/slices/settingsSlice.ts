import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define a type for the state
interface SettingsState {
  timezone: string;
  timeFormat: string;
  currency: string;
}

// Define a type for the payload
interface SettingsPayload {
  timezone: string;
  timeFormat: string;
  currency: string;
}

// Initial state
const initialState: SettingsState = {
  timezone: "",
  timeFormat: "",
  currency: ""
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setSettings: (state, action: PayloadAction<SettingsPayload>) => {
      state.timezone = action.payload.timezone;
      state.timeFormat = action.payload.timeFormat;
      state.currency = action.payload.currency;
    },
  },
});

export const { setSettings } = settingsSlice.actions;
