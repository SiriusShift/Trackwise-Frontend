import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import moment from "moment";

// Define the initial state as an object
const initialState: { active: Object; type: string; mode: string, action: boolean, activeRow?: Object, openDialog: boolean } = {
  active: {
    from: moment().startOf("month").toISOString(),
    to: moment().endOf("month").toISOString(),
  },
  action: false,
  mode: "monthly",
  type: "Expense",
  activeRow: null,
  openDialog: false
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
    setActionShow: (state, action: PayloadAction<boolean>) => {
      console.log(action, "testing")
      state.action = action.payload;
    },
    setType: (state, action: PayloadAction<string>) => {
      state.type = action.payload;
    },
    setActiveRow: (state, action: PayloadAction<Object>) => {
      state.activeRow = action.payload;
    },
    setOpenDialog: (state, action: PayloadAction<boolean>) => {
      state.openDialog = action.payload
    }
  },
});

// Export actions
export const { setActive, setType, setMode, setActionShow, setActiveRow, setOpenDialog } = active.actions;
