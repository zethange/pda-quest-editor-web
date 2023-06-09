import { pointType, spawnType } from "@/store/types/mapType";

export type chapterType = {
  id: number;
  music: any;
  stages: stageType[];
  points?: pointType[];
  spawns?: spawnType[];
};

export type stageType = {
  id: number;
  type_stage: number;
  background?: string;
  title?: string;
  message?: string;
  type_message?: number;
  texts?: stageText[];
  transfers?: stageTransfer[];
  actions?: {};
  data?: {
    map: string;
    pos: string;
  };
  editor?: {
    x?: number;
    y?: number;
  };
};

export type stageText = {
  text: string;
  condition: any;
};

export type stageTransfer = {
  text: string;
  stage: number;
  condition: any;
};
