import { createSlice } from "@reduxjs/toolkit";
import { pointType } from "@/store/types/mapType";

const mapSlice = createSlice({
  name: "map",
  initialState: {
    openPoint: {},
    newPoint: {
      type: "",
      pos: "",
      data: {
        chapter: "",
        stage: "",
      },
    },
    map: {
      points: [],
      spawns: [],
    },
  },
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
        state.map.points.filter(
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