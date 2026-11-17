"use client"
import { configureStore } from '@reduxjs/toolkit';
import { api } from '../shared/services/api'; // Import your API slice
import { signFormSlice } from '../shared/slices/userSlice';
import { active } from '@/shared/slices/activeSlice';
import { settingsSlice} from "@/shared/slices/settingsSlice"
import { applyWeekStartDay } from "@/shared/utils/weekStart"
export const store = configureStore({
  reducer: {
    userDetails: signFormSlice.reducer,
    active: active.reducer,
    settings: settingsSlice.reducer,

    // Add the RTK Query reducer
    [api.reducerPath]: api.reducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      api.middleware,
    ]), // Add the RTK Query middleware
});

// Keep moment's startOf("week")/endOf("week") in sync with the user's
// week start setting. Runs on dispatch, before React re-renders.
let lastWeekStartDay: number | undefined;
const syncWeekStart = () => {
  const day = store.getState().settings.weekStartDay;
  if (day === lastWeekStartDay) return;
  lastWeekStartDay = day;
  applyWeekStartDay(day);
};
syncWeekStart();
store.subscribe(syncWeekStart);

export type IRootState = ReturnType<typeof store.getState>