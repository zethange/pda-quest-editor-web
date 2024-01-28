import { IUser } from "@/shared/lib/type/user.type";
import { create } from "zustand";

export interface IUserStore {
  user: IUser | undefined;
  setUser: (user: IUser) => void;
}

export const useUserStore = create<IUserStore>((set) => ({
  user: undefined,
  setUser: (user: IUser) => {
    set({ user });
  },
}));
