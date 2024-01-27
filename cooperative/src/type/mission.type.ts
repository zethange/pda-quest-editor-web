export type MissionType = {
  title: string;
  name: string;
  checkpoints: CheckpointType[];
};

export type CheckpointType = {
  title: string;
  parameter: string;
  type: ["FIND_ITEM", "KILL", "TRAVEL"];
  condition: {
    [key: string]: string[];
  };
  actions: {
    [key: string]: string[];
  };
};
