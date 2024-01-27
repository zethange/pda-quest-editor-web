import { StoryType } from "@/shared/lib/type/story.type";
import { create } from "zustand";

export interface ICoopStore {
  ws: WebSocket | undefined;
  setWs: (ws: WebSocket) => void;

  onMessage: ((e: Event) => any) | null;

  handlers: ((e: Event) => void)[];
  handleMessage: (callback: (e: Event) => void) => void;

  sharedStories: {
    story: StoryType;
    owner: { login: string };
  }[];
  setSharedStories: (
    stories: {
      story: StoryType;
      owner: { login: string };
    }[]
  ) => void;

  id: string;
  setId: (id: string) => void;
}

export const useCoopStore = create<ICoopStore>((set, get) => ({
  ws: undefined,
  setWs: (ws: WebSocket) => {
    ws.onmessage = (e: Event) => {
      get().onMessage?.(e);
    };

    return set({ ws });
  },

  // LMAO
  handlers: [],
  onMessage: (e: Event) => {
    get().handlers.forEach((h) => h(e));
  },
  handleMessage: (callback: (e: Event) => void) => {
    return set((state) => ({
      handlers: [...state.handlers, callback],
    }));
  },

  sharedStories: [],
  setSharedStories: (
    stories: {
      story: StoryType;
      owner: { login: string };
    }[]
  ) => {
    return set({ sharedStories: stories });
  },

  id: "",
  setId: (id: string) => set({ id }),
}));
