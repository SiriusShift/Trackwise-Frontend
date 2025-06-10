import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import moment from "moment";

// Define the initial state as an object
const initialState: { expenseTab: string; activeMonth: string; type: string } =
  {
    expenseTab: "History",
    activeMonth: new Date().toISOString(), // ISO string
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
  },
});

// Export actions
export const { setActiveMonth, setType } = active.actions;
