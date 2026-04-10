export type MapEntity = {
  id: string;
  title: string;
  tmx: string;
  background?: string;
  defPos?: string;
  editor?: {
    url?: string;
  };
  points?: QuestPoint[];
  spawns?: Spawn[];
};

export type QuestPoint = {
  id?: string;
  type: number;
  name: string;
  pos: string;
  mapId?: string;
  data: {
    chapter: string;
    stage: string;
  };
  condition?: Record<string, string[]>;
  editor?: {
    x?: number;
    y?: number;
  };
  actions?: Record<string, string[]>;
};

export type Spawn = {
  group:
    | "LONERS"
    | "BANDITS"
    | "MILITARY"
    | "LIBERTY"
    | "DUTY"
    | "MONOLITH"
    | "MERCENARIES"
    | "SCIENTISTS"
    | "CLEARSKY";
  strength: "WEAK" | "STALKER" | "MIDDLE" | "MASTER" | "STRONG";
  n: string;
  r: string;
  pos: string;
  title?: string;
  description?: string;
  data?: Record<string, string[]>;
  actions?: Record<string, string[]>;
  condition?: Record<string, string[]>;
};

export type MapApi = {
  id: number;
  name: string;
  tmx: string;
  defaultPosition: {
    x: number;
    y: number;
  };
  title: string;
  background: string;
};
