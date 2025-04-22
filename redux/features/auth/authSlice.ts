import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  // Add other user properties as needed
}

interface AuthState {
  token: string;
  user: User | null;
}

const initialState: AuthState = {
  token: "",
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userRegistration: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
    },
    userLoggedIn: (
      state,
      action: PayloadAction<{ accessToken: string; user: User }>
    ) => {
      state.token = action.payload.accessToken;
      state.user = action.payload.user;
    },
    userLoggedOut: (state) => {
      state.token = "";
      state.user = null;
    },
  },
});

export const { userRegistration, userLoggedIn, userLoggedOut } =
  authSlice.actions;

export default authSlice.reducer;