import { configureStore } from "@reduxjs/toolkit";
import mapReducer from "./mapSlice";
import stageReducer from "./stageSlice";
import mapsSlice from "./chapterMapsSlice";

export default configureStore({
  reducer: {
    map: mapReducer,
    maps: mapsSlice,
    stage: stageReducer,
  },
});
