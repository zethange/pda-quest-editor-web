import type { QuestPoint, Spawn } from "@/entities/map";
import type { Mission } from "@/entities/mission";

export type Chapter = {
  id: number;
  title?: string;
  music?: string[];
  _comment?: string;
  stages: Stage[];
  points?: Record<`${number}`, QuestPoint[]>;
  spawns?: Record<`${number}`, Spawn[]>;
  catalog?: string;
  missions?: Mission[];
  mission?: Mission[];
};

export type Stage = {
  id: number;
  type_stage: number;
  background?: string;
  _comment?: string;
  title?: string;
  message?: string;
  type_message?: number;
  texts?: StageText[];
  transfers?: StageTransfer[];
  actions?: Record<string, string[]>;
  data?: {
    map: string;
    pos: string;
  };
  editor?: {
    x?: number;
    y?: number;
  };
};

export type StageCondition = Record<string, string[]>;

export type StageText = {
  text: string;
  condition: StageCondition;
};

export type StageTransfer = {
  text: string;
  stage: number;
  condition: StageCondition;
};
