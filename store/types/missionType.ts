export type missionType = {
  title: string;
  name: string;
  checkpoints: checkpointType[];
};

export type checkpointType = {
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
