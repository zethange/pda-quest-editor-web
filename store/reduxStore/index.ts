import { configureStore } from "@reduxjs/toolkit";
import mapReducer from "./mapSlice";
import stageReducer from "./stageSlice";

export default configureStore({
  reducer: {
    map: mapReducer,
    stage: stageReducer,
  },
});
