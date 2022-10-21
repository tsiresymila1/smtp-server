import loaderSlice from "../slice/loaderSlice";
import { configureStore } from "@reduxjs/toolkit";
import errorSlice from "../slice/errorSlice";
import authSlice from "../slice/authSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { emailApi } from "./services/emailApi";

export const store = configureStore({
  reducer: {
    loader: loaderSlice,
    error: errorSlice,
    auth: authSlice,
    [emailApi.reducerPath]: emailApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(emailApi.middleware),
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
