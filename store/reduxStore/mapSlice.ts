import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { mapType, pointType, spawnType } from "@/store/types/mapType";

type initialStateType = {
  openPoint: pointType;
  openSpawn: {
    openSpawn: spawnType;
    openSpawnIndex: number;
  };
  newPoint: pointType;
  map: mapType;
};

const initialState: initialStateType = {
  openPoint: {
    id: "1",
    name: "",
    pos: "",
    type: 0,
    data: {
      chapter: "",
      stage: "",
    },
  },
  openSpawn: {
    openSpawn: {
      group: "LONERS",
      pos: "",
      r: "",
      strength: "WEAK",
      n: "",
    },
    openSpawnIndex: 0,
  },
  newPoint: {
    id: "1",
    name: "",
    pos: "",
    type: 0,
    data: {
      chapter: "",
      stage: "",
    },
  },
  map: {
    id: "",
    title: "",
    tmx: "",
    points: [],
    spawns: [],
  },
};

interface ISetOpenStage {
  openSpawn: spawnType;
  openSpawnIndex: number;
}

const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setMap(state, action: PayloadAction<mapType>) {
      state.map = action.payload;
    },
    setOpenPoint(state, action) {
      state.openPoint = action.payload;
    },
    addSpawn(state, action: PayloadAction<string>) {
      state.map.spawns?.push({
        group: "LONERS",
        pos: action.payload,
        r: "25",
        strength: "WEAK",
        n: "",
        condition: {},
      });
    },
    setOpenSpawn(state, action: PayloadAction<ISetOpenStage>) {
      state.openSpawn = action.payload;
    },
    editSpawn(state, action: PayloadAction<spawnType>) {
      const updatedSpawn = {
        ...state.map.spawns![state.openSpawn.openSpawnIndex],
        ...action.payload,
      };
      console.log(updatedSpawn, action.payload);
      state.map.spawns?.splice(state.openSpawn.openSpawnIndex, 1, updatedSpawn);
    },
    editActionsSpawn(
      state,
      action: PayloadAction<{ [key: string]: string[] }>
    ) {
      const updatedSpawn = {
        ...state.map.spawns![state.openSpawn.openSpawnIndex],
        actions: action.payload,
      };
      state.map.spawns?.splice(state.openSpawn.openSpawnIndex, 1, updatedSpawn);
    },
    editDataSpawn(state, action: PayloadAction<{ [key: string]: string[] }>) {
      const updatedSpawn = {
        ...state.map.spawns![state.openSpawn.openSpawnIndex],
        data: action.payload,
      };
      state.map.spawns?.splice(state.openSpawn.openSpawnIndex, 1, updatedSpawn);
    },
    deleteSpawn(state, action: PayloadAction<number>) {
      state.map.spawns?.splice(action.payload, 1);
    },
    onPointCreate(state, action: PayloadAction<pointType>) {
      state.newPoint = action.payload;
    },
    addPoint(state, action: PayloadAction<pointType>) {
      state.map.points?.push(action.payload);
    },
    deletePoint(state) {
      const copyState = JSON.parse(JSON.stringify(state.map));
      const openPoint = JSON.parse(JSON.stringify(state.openPoint));
      const index = copyState.points.findIndex(
        (point: pointType) =>
          JSON.stringify(point) === JSON.stringify(openPoint)
      );

      state.map.points?.splice(index, 1);
    },
    editPoint(state, action) {
      const copyState = JSON.parse(JSON.stringify(state.map));
      const openPoint = JSON.parse(JSON.stringify(state.openPoint));
      const index = copyState.points.findIndex(
        (point: pointType) =>
          JSON.stringify(point) === JSON.stringify(openPoint)
      );

      state.map.points?.splice(index, 1, action.payload);
    },
  },
});

export const {
  setMap,
  setOpenPoint,
  addPoint,
  editPoint,
  onPointCreate,
  setOpenSpawn,
  deleteSpawn,
  editSpawn,
  addSpawn,
  deletePoint,
  editDataSpawn,
  editActionsSpawn,
} = mapSlice.actions;

export default mapSlice.reducer;
