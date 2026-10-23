import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import moment from "moment";

// Define the initial state as an object
const initialState: {
  active: {
    from: string;
    to: string;
  };
  type: string;
  mode: string;
  action: boolean;
  activeRow: object | null;
  openDialog: boolean;
  removingIds: number[]; // Rows playing their exit animation after archive
} = {
  active: {
    from: moment().startOf("month").toISOString(),
    to: moment().endOf("month").toISOString(),
  },
  action: false,
  mode: "monthly",
  type: "Expense",
  activeRow: null,
  openDialog: false,
  removingIds: [],
};

export const active = createSlice({
  name: "active",
  initialState,
  reducers: {
    setActive: (state, action: PayloadAction<{ from: string; to: string }>) => {
      state.active = action.payload;
    },
    setMode: (state, action: PayloadAction<string>) => {
      state.mode = action.payload;
    },
    setActionShow: (state, action: PayloadAction<boolean>) => {
      state.action = action.payload;
    },
    setType: (state, action: PayloadAction<string>) => {
      state.type = action.payload;
    },
    setActiveRow: (state, action: PayloadAction<object | null>) => {
      state.activeRow = action.payload;
    },
    setOpenDialog: (state, action: PayloadAction<boolean>) => {
      state.openDialog = action.payload;
    },
    markRemoving: (state, action: PayloadAction<number>) => {
      if (!state.removingIds.includes(action.payload)) {
        state.removingIds.push(action.payload);
      }
    },
    clearRemoving: (state, action: PayloadAction<number[]>) => {
      state.removingIds = state.removingIds.filter(
        (id) => !action.payload.includes(id),
      );
    },
  },
});

// Export actions
export const {
  setActive,
  setType,
  setMode,
  setActionShow,
  setActiveRow,
  setOpenDialog,
  markRemoving,
  clearRemoving,
} = active.actions;
