export type chapterType = {
  id: number;
  music: any;
  stages: stageType[];
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
  editor: {
    x: number;
    y: number;
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
