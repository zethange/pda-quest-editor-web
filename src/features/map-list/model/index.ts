import { createEvent, createStore, sample } from "effector";
import type { MapApi, MapEntity } from "@/entities/map";
import storage from "@/store/utils/storage";
import { createMap } from "@/store/tools/createMap";

export const mapsPageOpened = createEvent<{ storyId: string }>();
export const mapCreateRequested = createEvent<MapApi>();
export const mapDeleted = createEvent<number>();

export const $storyId = createStore("");
export const $maps = createStore<MapEntity[]>([]);

sample({
  clock: mapsPageOpened,
  fn: ({ storyId }) => storyId,
  target: $storyId,
});

sample({
  clock: mapsPageOpened,
  fn: ({ storyId }) => {
    const maps: MapEntity[] = [];
    storage.each((key, value: MapEntity) => {
      if (key.includes(`story_${storyId}_maps`) && !maps.find((map) => +map.id === +value.id)) {
        maps.push(value);
      }
      if (key === "stopLoop") return false;
    });
    return maps;
  },
  target: $maps,
});

$maps.on(mapCreateRequested, (maps, mapApi) => {
  const createdMap = createMap(mapApi);
  if (!createdMap) return maps;
  return [...maps, createdMap];
});

sample({
  source: $storyId,
  clock: mapCreateRequested,
  fn: (storyId, mapApi) => ({ storyId, createdMap: createMap(mapApi) }),
  filter: ({ createdMap }): createdMap is MapEntity => Boolean(createdMap),
}).watch(({ storyId, createdMap }) => {
  storage.set(`story_${storyId}_maps_${createdMap.id}`, createdMap);
});

$maps.on(mapDeleted, (maps, mapId) => maps.filter((map) => +map.id !== mapId));

sample({
  source: $storyId,
  clock: mapDeleted,
  fn: (storyId, mapId) => ({ storyId, mapId }),
}).watch(({ storyId, mapId }) => {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i) as string;
    if (key.includes(`story_${storyId}_chapter`)) {
      const value = JSON.parse(localStorage.getItem(key) as string) as {
        points?: Record<string, unknown>;
        spawns?: Record<string, unknown>;
      };
      if (value.points?.[mapId]) {
        delete value.points[mapId];
      }
      if (value.spawns?.[mapId]) {
        delete value.spawns[mapId];
      }
      localStorage.setItem(key, JSON.stringify(value));
    }
  }
  localStorage.removeItem(`story_${storyId}_maps_${mapId}`);
  location.reload();
});
