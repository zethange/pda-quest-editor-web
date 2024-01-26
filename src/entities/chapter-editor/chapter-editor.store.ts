import { ChapterType } from "@/shared/lib/type/chapter.type";
import { create } from "zustand";
import {
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  OnEdgesChange,
  OnNodesChange,
  applyEdgeChanges,
  applyNodeChanges,
} from "reactflow";

export interface IChapterEditorStore {
  storyId: number;
  chapterId: number;
  setChapterId: (chapterId: number) => void;
  setStoryId: (storyId: number) => void;

  //
  chapter: ChapterType | undefined;
  setChapter: (chapter: ChapterType) => void;

  //
  nodes: Node[];
  setNodes: (nodes: Node[]) => void;

  edges: Edge[];
  setEdges: (edges: Edge[]) => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
}

export const useChapterEditorStore = create<IChapterEditorStore>(
  (set, get) => ({
    storyId: 0,
    chapterId: 0,
    setChapterId: (chapterId: number) => set({ chapterId }),
    setStoryId: (storyId: number) => set({ storyId }),

    chapter: undefined,
    setChapter: (chapter: ChapterType) => set({ chapter }),

    nodes: [],
    setNodes: (nodes: Node[]) => set({ nodes }),
    edges: [],
    setEdges: (edges: Edge[]) => set({ edges }),

    onNodesChange: (changes: NodeChange[]) => {
      set({
        nodes: applyNodeChanges(changes, get().nodes),
      });
    },
    onEdgesChange: (changes: EdgeChange[]) => {
      set({
        edges: applyEdgeChanges(changes, get().edges),
      });
    },
  })
);
