"use client"
import { configureStore } from '@reduxjs/toolkit';
import { api } from '../feature/api'; // Import your API slice
import { signFormSlice } from '../feature/authentication/reducers/userDetail';
import { activeTabSlice } from '@/feature/reducers/activeTab';
export const store = configureStore({
  reducer: {
    userDetails: signFormSlice.reducer,
    activeTab: activeTabSlice.reducer,

    // Add the RTK Query reducer
    [api.reducerPath]: api.reducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      api.middleware,
    ]), // Add the RTK Query middleware
});