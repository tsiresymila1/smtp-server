import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../@types/data";
export interface AuthState {
  error?: string;
  access_token?: string;
  user?: User;
}

const initialState: AuthState = {
  error: null,
  access_token: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state = {
        error: null,
        user: null,
        access_token: null,
      };
      return state;
    },
    logged: (state, action: PayloadAction<AuthState>) => {
      localStorage.setItem(
        "user",
        JSON.stringify(
          {
            ...action.payload,
            error: null,
          },
          undefined,
          2
        )
      );
      state = action.payload;
      return state;
    },
  },
});
export const { logout, logged } = authSlice.actions;
export default authSlice.reducer;
