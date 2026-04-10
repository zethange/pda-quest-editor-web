import { ofetch } from "ofetch";

export const apiClient = ofetch.create({
  credentials: "include",
  onRequest({ options }) {
    options.headers = {
      ...options.headers,
      "Content-Type": "application/json",
    };
  },
});
