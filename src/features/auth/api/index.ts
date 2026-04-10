import { apiClient } from "@/shared/api";
import type { User } from "@/entities/user";

export const authApi = {
  getCurrentUser: () => apiClient<User>("/pdanetwork/api/v1/user/info"),
};
