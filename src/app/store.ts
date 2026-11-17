"use client"
import { configureStore } from '@reduxjs/toolkit';
import { api } from '../shared/services/api'; // Import your API slice
import { signFormSlice } from '../shared/slices/userSlice';
import { active } from '@/shared/slices/activeSlice';
import { settingsSlice} from "@/shared/slices/settingsSlice"
import { applyWeekStartDay } from "@/shared/utils/weekStart"
import { applyTimezone } from "@/shared/utils/timezone"
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

// Keep moment in sync with the user's date settings: the default timezone
// (every moment() call) and the week start day (startOf("week")/endOf("week")).
// Runs on dispatch, before React re-renders.
let lastTimezone: string | undefined;
let lastWeekStartDay: number | undefined;
const syncDateSettings = () => {
  const { timezone, weekStartDay } = store.getState().settings;
  if (timezone !== lastTimezone) {
    lastTimezone = timezone;
    applyTimezone(timezone);
  }
  if (weekStartDay !== lastWeekStartDay) {
    lastWeekStartDay = weekStartDay;
    applyWeekStartDay(weekStartDay);
  }
};
syncDateSettings();
store.subscribe(syncDateSettings);

export type IRootState = ReturnType<typeof store.getState>