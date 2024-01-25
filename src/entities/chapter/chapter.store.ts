import { ChapterType } from "@/shared/lib/type/chapter.type";
import { create } from "zustand";

export interface IChapterStore {
  storyId: number;
  setStoryId: (id: number) => void;
  chapters: ChapterType[];
  setChapters: (chapters: ChapterType[]) => void;
}

export const useChapterStore = create<IChapterStore>((set) => ({
  storyId: 0,
  chapters: [],
  setStoryId: (id) => set(() => ({ storyId: id })),
  setChapters: (chapters) => set(() => ({ chapters })),
}));
