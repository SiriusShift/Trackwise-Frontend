import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: null,
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  role: "",
  phoneNumber: "",
  profileImage: "" 
};

export const signFormSlice = createSlice({
  name: "userDetail",
  initialState: initialState,
  reducers: {
    userInfo: (state, action) => {
      state.id = action.payload.id;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.phoneNumber = action.payload.phoneNumber;
      state.profileImage = action.payload.profileImage
    },
  },
});

export const { userInfo } =
  signFormSlice.actions;
