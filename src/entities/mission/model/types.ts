export type Mission = {
  title: string;
  name: string;
  checkpoints: MissionCheckpoint[];
};

export type MissionCheckpoint = {
  title: string;
  parameter: string;
  type: ["FIND_ITEM", "KILL", "TRAVEL"];
  condition: Record<string, string[]>;
  actions: Record<string, string[]>;
};
