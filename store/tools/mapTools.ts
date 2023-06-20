import { mapApiType, mapType } from "@/store/types/mapType";

export function createMap(map: mapApiType): mapType {
  return {
    id: String(map.id),
    title: map.title,
    editor: {
      url: `/${map.background}`,
    },
    tmx: map.tmx,
    defPos: map.defaultPosition.x + ":" + map.defaultPosition.y,
    points: [],
    spawns: [],
  };
}
