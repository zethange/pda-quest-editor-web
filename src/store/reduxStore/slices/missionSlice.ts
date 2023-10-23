import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { checkpointType, missionType } from "@/store/types/story/missionType";
import { logger } from "@/store/utils/logger";

type initialStateType = {
  missions: missionType[];
  targetMission: {
    targetMission: missionType;
    targetMissionIndex: number;
    isOpen: boolean;
    targetCheckpoint: number;
  };
};

const initialState: initialStateType = {
  missions: [],
  targetMission: {
    targetMission: {
      name: "",
      title: "",
      checkpoints: [],
    },
    targetMissionIndex: 0,
    targetCheckpoint: 0,
    isOpen: false,
  },
};

interface ISetTargetMission {
  targetMission: missionType;
  targetMissionIndex: number;
}

const missionSlice = createSlice({
  name: "mission",
  initialState,
  reducers: {
    setMissions(state, action) {
      state.missions = action.payload;
    },
    setTargetMission(state, action: PayloadAction<ISetTargetMission>) {
      state.targetMission = {
        ...action.payload,
        isOpen: true,
        targetCheckpoint: 0,
      };
    },
    setTargetCheckpointIndex(state, action: PayloadAction<number>) {
      state.targetMission.targetCheckpoint = action.payload;
    },
    editMission(state, action) {
      const updatedMission = {
        ...state.targetMission.targetMission,
        ...action.payload,
      };
      state.targetMission.targetMission = updatedMission;
      state.missions.splice(
        state.targetMission.targetMissionIndex,
        1,
        updatedMission
      );
    },
    newMission(state, action: PayloadAction<missionType>) {
      state.missions.push(action.payload);
    },
    deleteMission(state, action: PayloadAction<number>) {
      state.missions.splice(action.payload, 1);
      state.targetMission.isOpen = false;
    },
    newCheckpoint(state) {
      const updatedMission = {
        ...state.targetMission.targetMission,
        checkpoints: [
          ...state.targetMission.targetMission.checkpoints,
          {
            title: "Новый чекпоинт",
            parameter: "...",
            type: "FIND_ITEM",
            condition: {},
            actions: {},
          },
        ],
      } as missionType;
      state.targetMission.targetMission = updatedMission;
      state.missions.splice(
        state.targetMission.targetMissionIndex,
        1,
        updatedMission
      );
    },
    editCheckpoint(
      state,
      action: PayloadAction<{ index: number; checkpoint: checkpointType }>
    ) {
      const { index, checkpoint } = action.payload;
      const updatedCheckpoint = {
        ...state.targetMission.targetMission.checkpoints[index],
        ...checkpoint,
      };
      state.targetMission.targetMission.checkpoints.splice(
        index,
        1,
        updatedCheckpoint
      );
      state.missions[state.targetMission.targetMissionIndex].checkpoints.splice(
        index,
        1,
        updatedCheckpoint
      );
    },
    deleteCheckpoint(state, action: PayloadAction<number>) {
      state.targetMission.targetMission.checkpoints.splice(action.payload, 1);
      state.missions[state.targetMission.targetMissionIndex].checkpoints.splice(
        action.payload,
        1
      );
    },
    editConditionInCheckpoint(
      state,
      action: PayloadAction<{
        index?: number;
        condition: { [key: string]: string[] };
      }>
    ) {
      const targetMission = JSON.parse(
        JSON.stringify(state.targetMission.targetMission)
      );
      logger.info(targetMission, action.payload);
      targetMission.checkpoints[action.payload.index!].condition =
        action.payload.condition;
      state.missions[state.targetMission.targetMissionIndex] = targetMission;
      state.targetMission.targetMission = targetMission;
    },
    editActionsInCheckpoint(
      state,
      action: PayloadAction<{
        index: number;
        actions: { [key: string]: string[] };
      }>
    ) {
      const targetMission = JSON.parse(
        JSON.stringify(state.targetMission.targetMission)
      );
      logger.info(targetMission, action.payload);
      targetMission.checkpoints[action.payload.index].actions =
        action.payload.actions;
      state.missions[state.targetMission.targetMissionIndex] = targetMission;
      state.targetMission.targetMission = targetMission;
    },
  },
});

export const {
  setMissions,
  setTargetMission,
  newMission,
  editMission,
  deleteMission,
  newCheckpoint,
  editCheckpoint,
  deleteCheckpoint,
  setTargetCheckpointIndex,
  editConditionInCheckpoint,
  editActionsInCheckpoint,
} = missionSlice.actions;

export default missionSlice.reducer;
