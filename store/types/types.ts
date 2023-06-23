import { pointType, spawnType } from "@/store/types/mapType";

export type chapterType = {
  id: number;
  music?: string[];
  stages: stageType[];
  points?: { [key: `${number}`]: pointType[] };
  spawns?: { [key: `${number}`]: spawnType[] };
};

export type stageType = {
  id: number;
  type_stage: number;
  background?: string;
  _comment?: string;
  title?: string;
  message?: string;
  type_message?: number;
  texts?: stageText[];
  transfers?: stageTransfer[];
  actions?: {
    [key: string]: string[];
  };
  data?: {
    map: string;
    pos: string;
  };
  editor?: {
    x?: number;
    y?: number;
  };
};

export type conditionType = {
  [key: string]: string[];
};

export type stageText = {
  text: string;
  condition: conditionType;
};

export type stageTransfer = {
  text: string;
  stage: number;
  condition: conditionType;
};
