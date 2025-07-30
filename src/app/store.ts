"use client"
import { configureStore } from '@reduxjs/toolkit';
import { api } from '../shared/services/api'; // Import your API slice
import { signFormSlice } from '../shared/slices/userSlice';
import { active } from '@/shared/slices/activeSlice';
import { settingsSlice} from "@/shared/slices/settingsSlice"
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