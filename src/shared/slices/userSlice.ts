import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: null,
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  role: "",
  phoneNumber: "",
  profileImage: "",
  google_id: "",
  // false for Google-only accounts that haven't set a password yet
  hasPassword: true,
  // null until /auth-status loads, so the tour doesn't start before we know
  hasSeenTour: null as boolean | null,
};

export const signFormSlice = createSlice({
  name: "userDetail",
  initialState: initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.id = action.payload.id;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.phoneNumber = action.payload.phoneNumber;
      state.profileImage = action.payload.profileImage;
      state.google_id = action.payload.google_id;
      state.hasPassword = action.payload.hasPassword ?? state.hasPassword;
      state.hasSeenTour = action.payload.hasSeenTour ?? state.hasSeenTour;
    },
    setHasPassword: (state, action) => {
      state.hasPassword = action.payload;
    },
    setHasSeenTour: (state, action) => {
      state.hasSeenTour = action.payload;
    },
  },
});

export const { setUserInfo, setHasSeenTour, setHasPassword } =
  signFormSlice.actions;
