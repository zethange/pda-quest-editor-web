import EditChapterDrawer from "@/components/Chapter/EditChapterDrawer";
import type { Chapter } from "@/entities/chapter";
import type { Dispatch, SetStateAction } from "react";

interface ChapterEditorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  storyId: number;
  chapter: Chapter;
  setChapter: Dispatch<SetStateAction<Chapter>>;
  onUpdate: () => void;
  deleteChapter: (chapterId: number) => void;
}

export function ChapterEditorDrawer(props: ChapterEditorDrawerProps) {
  return <EditChapterDrawer {...props} />;
}
