import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  login: null,
  token: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authenticate: (state, action) => {
      state.login = action.payload.login;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
    },

    setToken: (state, action) => {
      state.token = action.payload;
    },

    logout: (state) => {
      state.login = null;
      state.token = null;
      state.refreshToken = null;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice;
