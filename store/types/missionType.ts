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
