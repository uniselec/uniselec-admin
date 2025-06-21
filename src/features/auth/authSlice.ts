import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";


const tokenFromLocalStorage = localStorage.getItem("AUTH_TOKEN");
const userDetailsFromLocalStorage = localStorage.getItem("AUTH_USER");

const initialState = {
  token: tokenFromLocalStorage ? tokenFromLocalStorage : "",
  userDetails: userDetailsFromLocalStorage ? JSON.parse(userDetailsFromLocalStorage) : {},
  isAuthenticated: userDetailsFromLocalStorage ? true : false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.userDetails = action.payload.user;
      localStorage.setItem("AUTH_TOKEN", state.token);
      localStorage.setItem("AUTH_USER", JSON.stringify(state.userDetails));
    },
    logOut: state => {
			state.token = "";
      state.isAuthenticated = false;
      state.userDetails = null;
      localStorage.removeItem("AUTH_TOKEN");
      localStorage.removeItem("AUTH_USER");
		},
  },
});

export const { logOut, setCredentials } =
  authSlice.actions;

export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;

export const selectAuthUser = (state: RootState) => state.auth.userDetails;