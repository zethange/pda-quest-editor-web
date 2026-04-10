import { createEvent, createStore } from "effector";
import type { MapEntity, QuestPoint, Spawn } from "@/entities/map";

type OpenSpawnState = {
  openSpawn: Spawn;
  openSpawnIndex: number;
};

const emptyPoint: QuestPoint = {
  id: "1",
  name: "",
  pos: "",
  type: 0,
  data: {
    chapter: "",
    stage: "",
  },
};

const emptySpawn: Spawn = {
  group: "LONERS",
  pos: "",
  r: "",
  strength: "WEAK",
  n: "",
};

const emptyMap: MapEntity = {
  id: "",
  title: "",
  tmx: "",
  points: [],
  spawns: [],
};

export const mapLoaded = createEvent<MapEntity>();
export const openPointSet = createEvent<QuestPoint>();
export const pointCreateStarted = createEvent<QuestPoint>();
export const pointAdded = createEvent<QuestPoint>();
export const pointUpdated = createEvent<QuestPoint>();
export const pointDeleted = createEvent();

export const openSpawnSet = createEvent<OpenSpawnState>();
export const spawnAdded = createEvent<string>();
export const spawnUpdated = createEvent<Partial<Spawn>>();
export const spawnDeleted = createEvent<number>();
export const spawnActionsUpdated = createEvent<Record<string, string[]>>();
export const spawnDataUpdated = createEvent<Record<string, string[]>>();

export const $map = createStore<MapEntity>(emptyMap)
  .on(mapLoaded, (_, map) => map)
  .on(pointAdded, (map, point) => ({ ...map, points: [...(map.points || []), point] }))
  .on(pointUpdated, (map, point) => {
    const openPoint = $openPoint.getState();
    const index = (map.points || []).findIndex(
      (item) => JSON.stringify(item) === JSON.stringify(openPoint)
    );
    if (index < 0) return map;
    const nextPoints = [...(map.points || [])];
    nextPoints.splice(index, 1, point);
    return { ...map, points: nextPoints };
  })
  .on(pointDeleted, (map) => {
    const openPoint = $openPoint.getState();
    const index = (map.points || []).findIndex(
      (item) => JSON.stringify(item) === JSON.stringify(openPoint)
    );
    if (index < 0) return map;
    const nextPoints = [...(map.points || [])];
    nextPoints.splice(index, 1);
    return { ...map, points: nextPoints };
  })
  .on(spawnAdded, (map, pos) => ({
    ...map,
    spawns: [
      ...(map.spawns || []),
      { group: "LONERS", pos, r: "25", strength: "WEAK", n: "", condition: {} },
    ],
  }))
  .on(spawnUpdated, (map, patch) => {
    const { openSpawnIndex } = $openSpawn.getState();
    const current = map.spawns?.[openSpawnIndex];
    if (!current) return map;
    const nextSpawns = [...(map.spawns || [])];
    nextSpawns.splice(openSpawnIndex, 1, { ...current, ...patch });
    return { ...map, spawns: nextSpawns };
  })
  .on(spawnDeleted, (map, index) => {
    const nextSpawns = [...(map.spawns || [])];
    nextSpawns.splice(index, 1);
    return { ...map, spawns: nextSpawns };
  })
  .on(spawnActionsUpdated, (map, actions) => {
    const { openSpawnIndex } = $openSpawn.getState();
    const current = map.spawns?.[openSpawnIndex];
    if (!current) return map;
    const nextSpawns = [...(map.spawns || [])];
    nextSpawns.splice(openSpawnIndex, 1, { ...current, actions });
    return { ...map, spawns: nextSpawns };
  })
  .on(spawnDataUpdated, (map, data) => {
    const { openSpawnIndex } = $openSpawn.getState();
    const current = map.spawns?.[openSpawnIndex];
    if (!current) return map;
    const nextSpawns = [...(map.spawns || [])];
    nextSpawns.splice(openSpawnIndex, 1, { ...current, data });
    return { ...map, spawns: nextSpawns };
  });

export const $openPoint = createStore<QuestPoint>(emptyPoint).on(
  openPointSet,
  (_, point) => point
);

export const $newPoint = createStore<QuestPoint>(emptyPoint).on(
  pointCreateStarted,
  (_, point) => point
);

export const $openSpawn = createStore<OpenSpawnState>({
  openSpawn: emptySpawn,
  openSpawnIndex: 0,
}).on(openSpawnSet, (_, state) => state);
