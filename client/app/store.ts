import loaderSlice from "../slice/loaderSlice";
import { configureStore } from "@reduxjs/toolkit";
import errorSlice from "../slice/errorSlice";
import authSlice from "../slice/authSlice";
import emailSlice from "../slice/emailSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const store = configureStore({
  reducer: {
    loader: loaderSlice,
    error: errorSlice,
    auth: authSlice,
    email: emailSlice
  },
});


export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export type RootState = ReturnType<typeof store.getState>
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector

