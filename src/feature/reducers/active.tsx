import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import moment from "moment";

// Define the initial state as an object
const initialState: { expenseTab: string, activeMonth: string } = {
  expenseTab: "All",
  activeMonth: new Date().toISOString(), // ISO string
};


export const active = createSlice({
  name: "active",
  initialState,
  reducers: {
    setExpenseTab: (state, action: PayloadAction<{ expenseTab: string }>) => {
      console.log(action.payload)
      // Update the `expenseTab` property without overwriting the entire state object
      state.expenseTab = action.payload.expenseTab;
    },
    setActiveMonth: (state, action: PayloadAction<{ activeMonth: string }>) => {
      state.activeMonth = action.payload.activeMonth;
    }
  },
});

// Export actions
export const { setExpenseTab, setActiveMonth } = active.actions;