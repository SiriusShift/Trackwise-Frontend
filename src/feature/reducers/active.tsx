import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import moment from "moment";

// Define the initial state as an object
const initialState: { expenseTab: string, activeMonth: string } = {
  expenseTab: "History",
  activeMonth: new Date().toISOString(), // ISO string
};


export const active = createSlice({
  name: "active",
  initialState,
  reducers: {
    setExpenseTab: (state, action: PayloadAction<string>) => {
      console.log(action.payload)
      // Update the `expenseTab` property without overwriting the entire state object
      state.expenseTab = action.payload;
    },
    setActiveMonth: (state, action: PayloadAction<string>) => {
      state.activeMonth = action.payload;
    }
  },
});

// Export actions
export const { setExpenseTab, setActiveMonth } = active.actions;