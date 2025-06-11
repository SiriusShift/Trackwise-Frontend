import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import moment from "moment";

// Define the initial state as an object
const initialState: { activeMonth: string; type: string; activeYear: string } =
  {
    activeMonth: new Date().toISOString(), // ISO string
    activeYear: moment().format("YYYY"),
    type: "Expense",
  };

export const active = createSlice({
  name: "active",
  initialState,
  reducers: {
    setActiveMonth: (state, action: PayloadAction<string>) => {
      state.activeMonth = action.payload;
    },
    setType: (state, action: PayloadAction<string>) => {
      state.type = action.payload;
    },
    setActiveYear: (state, action: PayloadAction<string>) => {
      state.activeYear = action.payload;
    }
  },
});

// Export actions
export const { setActiveMonth, setType, setActiveYear } = active.actions;
