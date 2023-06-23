import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { mapType } from "@/store/types/mapType";

const mapsSlice = createSlice({
  name: "maps",
  initialState: {
    maps: [],
  },
  reducers: {
    setMaps: (state, action: PayloadAction<mapType>) => {
      // @ts-ignore
      state.maps.push(action.payload);
    },
  },
});

export const { setMaps } = mapsSlice.actions;

export default mapsSlice.reducer;
