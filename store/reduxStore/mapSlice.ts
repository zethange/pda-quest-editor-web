import { createSlice } from "@reduxjs/toolkit";
import { pointType } from "@/store/types/mapType";

const mapSlice = createSlice({
  name: "map",
  initialState: {
    map: {
      points: [],
      spawns: [],
    },
  },
  reducers: {
    setMap(state, action) {
      console.log(state, action);
      state.map = action.payload.map;
      console.log("Внутри стора", state);
    },
    addPoint(state, action: { payload: { point: pointType }; type: string }) {
      // @ts-ignore
      state.map.points.push(action.payload.point);
    },
    addSpawn(state, action) {},
    deletePoint(state, action) {},
    deleteSpawn(state, action) {},
    editPoint(state, action) {},
    editSpawn(state, action) {},
  },
});

export const { setMap, addPoint, addSpawn, deleteSpawn, editSpawn, editPoint } =
  mapSlice.actions;

export default mapSlice.reducer;
