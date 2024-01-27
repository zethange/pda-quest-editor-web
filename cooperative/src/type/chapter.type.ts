import { PointType, SpawnType } from "./map.type";
import { MissionType } from "./mission.type";

export type ChapterType = {
  id: number;
  title?: string;
  music?: string[];
  _comment?: string;
  stages: StageType[];
  points?: { [key: `${number}`]: PointType[] };
  spawns?: { [key: `${number}`]: SpawnType[] };
  catalog?: string;
  missions?: MissionType[];
  mission?: MissionType[];
};

export type StageType = {
  id: number;
  type_stage: number;
  background?: string;
  _comment?: string;
  title?: string;
  message?: string;
  type_message?: number;
  texts?: StageTextType[];
  transfers?: StageTransferType[];
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

export type ConditionType = {
  [key: string]: string[];
};

export type StageTextType = {
  _id?: string;
  text: string;
  condition: ConditionType;
};

export type StageTransferType = {
  text: string;
  stage: number;
  condition: ConditionType;
};
