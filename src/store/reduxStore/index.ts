import { configureStore } from "@reduxjs/toolkit";
import mapReducer from "./slices/mapSlice";
import stageReducer from "./slices/stageSlice";
import mapsSlice from "./slices/chapterMapsSlice";
import missionSlice from "./slices/missionSlice";
import userSlice from "./slices/userSlice";

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
