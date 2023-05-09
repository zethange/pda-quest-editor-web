import { createSlice } from "@reduxjs/toolkit";
import { mapType } from "@/store/types/mapType";

interface ActionSetMaps {
  payload: mapType;
  type: string;
}

const mapsSlice = createSlice({
  name: "maps",
  initialState: {
    maps: [],
  },
  reducers: {
    setMaps: (state, action: ActionSetMaps) => {
      // @ts-ignore
      state.maps.push(action.payload);
    },
  },
});

export const { setMaps } = mapsSlice.actions;

export default mapsSlice.reducer;
