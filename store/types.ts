export type chapterType = {
  id: number;
  music: any;
  stages: stageType[];
};

export type stageType = {
  id: number;
  type_stage: number;
  background_url?: string;
  title?: string;
  message?: string;
  type_message?: number;
  texts?: stageText[];
  transfers?: stageTransfers[];
  actions?: {};
  data?: {
    map: string;
    pos: string;
  };
  editor: {
    x: number;
    y: number;
  };
};

export type stageText = {
  text: string;
  conditions: any;
};

export type stageTransfers = {
  text: string;
  stage_id: number;
  conditions: any;
};

// mission.json

export type missionsType = missionsType[];

export type missionType = {
  title: string;
  name: string;
  checkpoints: checkpointType[];
};

export type checkpointType = {
  title: string;
  parameter: string;
  chapter: string;
  stage: string;
};
