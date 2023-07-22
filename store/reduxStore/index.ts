import { configureStore } from "@reduxjs/toolkit";
import mapReducer from "./mapSlice";
import stageReducer from "./stageSlice";
import mapsSlice from "./chapterMapsSlice";
import missionSlice from "./missionSlice";
import userSlice from "./userSlice";

const store = configureStore({
  reducer: {
    map: mapReducer,
    maps: mapsSlice,
    stage: stageReducer,
    mission: missionSlice,
    user: userSlice,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
