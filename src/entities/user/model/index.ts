import { createEvent, createStore } from "effector";
import type { User, UserSettings } from "./types";

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
export const userSettingsChanged = createEvent<Partial<UserSettings>>();
export const userSettingsLoaded = createEvent<UserSettings>();

export const $currentUser = createStore<User>(emptyUser)
  .on(userReceived, (_, user) => user)
  .reset(userReset);

const defaultSettings: UserSettings = {
  danyaMod: false,
  showMiniMap: true,
  onlyRenderVisibleElements: false,
  useAlternativeDagre: false,
  enableUtilities: false,
  drawerEditStageWidth: "450",
  alternativeMapViewer: false,
  nodeWidth: "300",
  nodeHeight: "100",
};

export const $userSettings = createStore<UserSettings>(defaultSettings)
  .on(userSettingsChanged, (state, patch) => ({ ...state, ...patch }))
  .on(userSettingsLoaded, (_, settings) => settings);
