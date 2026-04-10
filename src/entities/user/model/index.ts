import { createEvent, createStore } from "effector";
import type { User } from "./types";

const emptyUser: User = {
  avatar: "",
  email: "",
  gang: "",
  id: "",
  lastLoginAt: "",
  login: "",
  name: "",
  nickname: "",
  pdaId: 0,
  registration: "",
  role: "",
  xp: 0,
};

export const userReceived = createEvent<User>();
export const userReset = createEvent();

export const $currentUser = createStore<User>(emptyUser)
  .on(userReceived, (_, user) => user)
  .reset(userReset);
