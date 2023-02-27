import create from "zustand";

const useChapterStore = create((set) => ({
  chapters: [],
  addChapter: (chapter: any) =>
    set((state: any) => ({
      chapters: [...chapter, ...state.chapters],
    })),
  setChapter: (chapters: any[]) =>
    set((state: any) => ({
      chapters: [...chapters],
    })),
}));

export default useChapterStore;
