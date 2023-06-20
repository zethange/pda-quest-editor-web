import { createSlice } from "@reduxjs/toolkit";
import { mapType, pointType } from "@/store/types/mapType";

type initialStateType = {
  openPoint: pointType;
  newPoint: pointType;
  map: mapType;
};

const initialState: initialStateType = {
  openPoint: {
    id: "1",
    name: "",
    pos: "",
    type: "",
    data: {
      chapter: "",
      stage: "",
    },
  },
  newPoint: {
    id: "1",
    name: "",
    pos: "",
    type: "",
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

const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setMap(state, action) {
      state.map = action.payload.map;
    },
    setOpenPoint(state, action) {
      state.openPoint = action.payload;
    },
    onPointCreate(state, action) {
      state.newPoint = action.payload;
    },
    addPoint(state, action) {
      // @ts-ignore
      state.map.points.push(action.payload);
    },
    addSpawn(state, action) {},
    deletePoint(state, action) {
      console.log(
        state.map.points?.filter(
          (point: pointType) =>
            JSON.stringify(point) !== JSON.stringify(action.payload)
        )
      );
    },
    deleteSpawn(state, action) {},
    editPoint(state, action) {
      const copyState = JSON.parse(JSON.stringify(state.map));
      const openPoint = JSON.parse(JSON.stringify(state.openPoint));
      const index = copyState.points.findIndex(
        (point: pointType) =>
          JSON.stringify(point) === JSON.stringify(openPoint)
      );

      // @ts-ignore
      state.map.points.splice(index, 1, action.payload);
    },
    editSpawn(state, action) {},
  },
});

export const {
  setMap,
  setOpenPoint,
  addPoint,
  addSpawn,
  deleteSpawn,
  editSpawn,
  editPoint,
  onPointCreate,
} = mapSlice.actions;

export default mapSlice.reducer;
