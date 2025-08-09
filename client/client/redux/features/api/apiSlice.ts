import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn } from "../auth/authSlice";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  // Add other user properties as needed
}

interface UserResponse {
  accessToken: string;
  user: User;
}

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URI || 'http://localhost:8000';

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      // Only access localStorage in browser environment
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem("accessToken");
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    refreshToken: builder.query<UserResponse, void>({
      query: () => ({
        url: `${baseUrl}/refresh`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    loadUser: builder.query<UserResponse, void>({
      query: () => ({
        url: `${baseUrl}/me`,
        method: "GET",
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLoggedIn({
              accessToken: result.data.accessToken,
              user: result.data.user,
            })
          );
        } catch (error) {
          console.error("Failed to load user:", error);
          // Handle error appropriately, e.g., redirect to login
        }
      },
    }),
  }),
});

export const { useRefreshTokenQuery, useLoadUserQuery } = apiSlice;
