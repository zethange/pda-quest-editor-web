import { StageType } from "@/shared/lib/type/chapter.type";
import { PointType } from "@/shared/lib/type/map.type";
import { create } from "zustand";

export interface IStageStore {
  stage: StageType | undefined;
  editStage: (stage: Partial<StageType>) => void;
  setStage: (stage: StageType) => void;

  point: PointType | undefined;
  editPoint: (point: Partial<PointType>) => void;
  setPoint: (point: PointType) => void;

  reset: () => void;
}

export const useStageStore = create<IStageStore>((set) => ({
  stage: undefined,
  editStage: (stage: Partial<StageType>) => {
    return set((state) => ({
      stage: { ...state.stage, ...(stage as StageType) },
    }));
  },
  setStage: (stage: StageType) => set({ stage }),

  point: undefined,
  editPoint: (point: Partial<PointType>) => {
    return set((state) => ({
      point: { ...state.point, ...(point as PointType) },
    }));
  },
  setPoint: (point: PointType) => set({ point }),

  reset: () => set({ stage: undefined, point: undefined }),
}));
