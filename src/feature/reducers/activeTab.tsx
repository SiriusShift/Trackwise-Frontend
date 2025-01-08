import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the initial state as an object
const initialState: { expenseTab: string } = {
  expenseTab: "All",
};

export const activeTabSlice = createSlice({
  name: "activeTab",
  initialState,
  reducers: {
    setExpenseTab: (state, action: PayloadAction<{ expenseTab: string }>) => {
      // Update the `expenseTab` property without overwriting the entire state object
      state.expenseTab = action.payload.expenseTab;
    },
  },
});

// Export actions
export const { setExpenseTab } = activeTabSlice.actions;