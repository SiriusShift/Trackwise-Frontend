import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import moment from "moment";

// Define the initial state as an object
const initialState: { active: Object; type: string; mode: string; } =
  {
    active: new Date(),
    mode: "daily",
    type: "Expense",
  };

export const active = createSlice({
  name: "active",
  initialState,
  reducers: {
    setActive: (state, action: PayloadAction<Object>) => {
      state.active = action.payload;
    },
    setMode: (state, action: PayloadAction<string>) => {
      state.mode = action.payload;
    },
    setType: (state, action: PayloadAction<string>) => {
      state.type = action.payload;
    },
  },
});

// Export actions
export const { setActive, setType, setMode } = active.actions;
