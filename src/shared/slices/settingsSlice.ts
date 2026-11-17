import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define a type for the state
interface SettingsState {
  timezone: string;
  timeFormat: string;
  dateFormat: string;
  currency: string;
  weekStartDay: number;
}

// Define a type for the payload
interface SettingsPayload {
  timezone: string;
  timeFormat: string;
  dateFormat: string;
  currency: string;
  weekStartDay?: number;
}

// Initial state
const initialState: SettingsState = {
  timezone: "",
  timeFormat: "",
  dateFormat: "",
  currency: "",
  weekStartDay: 0, // 0 = Sunday … 6 = Saturday
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setSettings: (state, action: PayloadAction<SettingsPayload>) => {
      state.timezone = action.payload.timezone;
      state.timeFormat = action.payload.timeFormat;
      state.dateFormat = action.payload.dateFormat;
      state.currency = action.payload.currency;
      state.weekStartDay = action.payload.weekStartDay ?? 0;
    },
  },
});

export const { setSettings } = settingsSlice.actions;
