"use client";
import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import authSlice from "./auth/authSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSlice,
  },
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Only initialize app on client side
if (typeof window !== 'undefined') {
  const initializeApp = async () => {
    try {
      await store.dispatch(
        apiSlice.endpoints.loadUser.initiate(undefined, { forceRefetch: true })
      );
    } catch (error) {
      console.error("Failed to initialize app:", error);
    }
  };

  // Use requestIdleCallback for better performance
  if (window.requestIdleCallback) {
    window.requestIdleCallback(initializeApp);
  } else {
    // Fallback for browsers that don't support requestIdleCallback
    setTimeout(initializeApp, 0);
  }
}
