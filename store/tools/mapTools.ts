import { mapType } from "@/store/types/mapType";

export type MapsApiType = {
  id: number;
  name: string;
  title: string;
  background: string;
};

export function createMap(map: MapsApiType): mapType {
  return {
    id: String(map.id),
    title: map.title,
    editor: {
      url: `/${map.background}`,
    },
    tmx: ``,
    defPos: ``,
    points: [],
    spawns: [],
  };
}
