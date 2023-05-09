import { mapType } from "@/store/types/mapType";

export type Map =
  | "CH4"
  | "ESCAPE"
  | "AGROPROM"
  | "GARBAGE"
  | "DARK_VALLEY"
  | "YANTAR"
  | "ROSTOK"
  | "BAR"
  | "MILITARY"
  | "RADAR";

export function createMap(map: Map, mapId: number): mapType | null {
  const id = String(mapId);
  switch (map) {
    case "CH4":
      return {
        id,
        title: "Чернобыль-4",
        tmx: "ch4.tmx",
        editor: {
          url: "/map_ch_4.png",
        },
        defPos: "1330:1030",
        points: [],
        spawns: [],
      };
    case "ESCAPE":
      return {
        id,
        title: "Кордон",
        tmx: "kordon.tmx",
        editor: {
          url: "/map_escape.png",
        },
        defPos: "330:960",
        points: [],
        spawns: [],
      };
    case "AGROPROM":
      return {
        id,
        title: "НИИ Агропром",
        tmx: "agroprom.tmx",
        editor: {
          url: "/map_agroprom.png",
        },
        defPos: "330:960",
        points: [],
        spawns: [],
      };
    case "GARBAGE":
      return {
        id,
        title: "Свалка",
        tmx: "garbage.tmx",
        editor: {
          url: "/map_garbage.png",
        },
        defPos: "330:960",
        points: [],
        spawns: [],
      };
    case "DARK_VALLEY":
      return {
        id,
        title: "Темная долина",
        tmx: "darkvalley.tmx",
        defPos: "330:960",
        editor: {
          url: "/map_darkvalley.png",
        },
        points: [],
        spawns: [],
      };
    case "YANTAR":
      return null;
    case "ROSTOK":
      return {
        id,
        title: "Дикая территория",
        tmx: "bar.tmx",
        editor: {
          url: "/map_bar.png",
        },
        defPos: "330:960",
        points: [],
        spawns: [],
      };
    case "BAR":
      return {
        id,
        title: "Бар",
        tmx: "bar.tmx",
        editor: {
          url: "/map_bar.png",
        },
        points: [],
        spawns: [],
      };
    case "MILITARY":
      return {
        id,
        title: "Армейские склады",
        tmx: "military.tmx",
        editor: {
          url: "/map_military.png",
        },
        defPos: "330:960",
        points: [],
        spawns: [],
      };
    case "RADAR":
      // надо доделать
      return null;
  }
}
