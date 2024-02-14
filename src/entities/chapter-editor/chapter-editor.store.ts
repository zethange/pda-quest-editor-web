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
  ReactFlowInstance,
} from "reactflow";

export interface IChapterEditorStore {
  storyId: number;
  chapterId: number;
  setChapterId: (chapterId: number) => void;
  setStoryId: (storyId: number) => void;

  //
  chapter: ChapterType | undefined;
  setChapter: (chapter: ChapterType) => void;

  parameters: string[];
  setParameters: (parameters: string[]) => void;

  //
  nodes: Node[];
  setNodes: (nodes: Node[]) => void;
  reactFlowInstance: ReactFlowInstance | undefined;
  setReactFlowInstance: (reactFlowInstance: ReactFlowInstance) => void;

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
    parameters: [],
    setParameters: (parameters: string[]) => set({ parameters }),

    nodes: [],
    setNodes: (nodes: Node[]) => set({ nodes }),
    edges: [],
    setEdges: (edges: Edge[]) => set({ edges }),

    reactFlowInstance: undefined,
    setReactFlowInstance: (reactFlowInstance: ReactFlowInstance) =>
      set({ reactFlowInstance }),

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
