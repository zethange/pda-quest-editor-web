import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const Api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "https://dev.artux.net",
    prepareHeaders: (headers) => {
      const token = window.localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Basic ${token}`);
        headers.set("Content-Type", "application/json");
      } else {
        window.location.replace("/auth/login");
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
});
