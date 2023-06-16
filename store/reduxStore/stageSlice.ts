import { createSlice } from "@reduxjs/toolkit";
import { stageTransfer, stageType } from "@/store/types/types";
import { pointType } from "@/store/types/mapType";

interface IOriginalPoint extends pointType {
  mapId: `${number}`;
}

interface IState {
  targetTransfer: {
    targetTransfer: stageTransfer;
    indexTargetTransfer: number;
  };
  transition: { point: pointType; targetStage: stageType };
  connection: {
    source: number;
    target: number;
    indexCreatedTransfer: number;
  };
  stage: stageType;
  transitionFromMap: {
    id: number;
    mapId: `${number}`;
    originalPoint: IOriginalPoint;
    point: pointType;
  };
}

const initialState: IState = {
  transition: {
    point: {
      data: { stage: "", chapter: "" },
      id: "",
      condition: {},
      pos: "",
      name: "",
      type: "",
    },
    targetStage: {
      id: 0,
      type_stage: 0,
      background: "",
      title: "",
      message: "",
      type_message: 0,
      texts: [
        {
          text: "",
          condition: {},
        },
      ],
      transfers: [],
      data: {
        pos: "",
        map: "",
      },
      actions: {},
    },
  },
  targetTransfer: {
    targetTransfer: {
      text: "",
      condition: {},
      stage: 0,
    },
    indexTargetTransfer: 0,
  },
  connection: {
    source: 0,
    target: 0,
    indexCreatedTransfer: 0,
  },
  stage: {
    id: 0,
    type_stage: 0,
    background: "",
    title: "",
    message: "",
    type_message: 0,
    texts: [
      {
        text: "",
        condition: {},
      },
    ],
    transfers: [],
    data: {
      pos: "",
      map: "",
    },
    actions: {},
  },
  transitionFromMap: {
    id: 0,
    mapId: "0",
    point: {
      data: { stage: "", chapter: "" },
      id: "",
      condition: {},
      pos: "",
      name: "",
      type: "",
    },
    originalPoint: {
      mapId: "0",
      data: { stage: "", chapter: "" },
      id: "",
      condition: {},
      pos: "",
      name: "",
      type: "",
    },
  },
};

const stageSlice = createSlice({
  name: "stage",
  initialState,
  reducers: {
    setStageToStore(state, action) {
      state.stage = action.payload;
    },
    newTextInStore(state, action) {
      if (state.stage.texts) {
        state.stage.texts.push({ text: "Новый текст", condition: {} });
      }
    },
    newTransferInStore(state, action) {
      const storeStage = JSON.parse(JSON.stringify(state.stage));
      const transfer: stageTransfer = action.payload;

      if (!storeStage.transfers) {
        storeStage.transfers = [];
      }
      if (
        !storeStage.transfers.find(
          (findTransfer: stageTransfer) => findTransfer.stage === transfer.stage
        )
      ) {
        storeStage.transfers.push(transfer);
        state.stage.transfers = storeStage.transfers;
      } else {
        const index = storeStage.transfers.indexOf(
          storeStage.transfers.find(
            (findTransfer: stageTransfer) =>
              findTransfer.stage === transfer.stage
          )
        );
        storeStage.transfers.splice(index, 1, transfer);
        state.stage.transfers = storeStage.transfers;
      }
      state.connection.indexCreatedTransfer =
        storeStage.transfers.indexOf(transfer);
    },
    editTitleInStore(state, action) {
      state.stage.title = action.payload;
    },
    editBackgroundInStore(state, action) {
      state.stage.background = action.payload;
    },
    editMessageInStore(state, action) {
      state.stage.message = action.payload;
    },
    editTextInStore(state, action) {
      const storeStage = JSON.parse(JSON.stringify(state.stage));
      const { id, text } = action.payload;
      storeStage.texts.splice(+id, 1, text);
      state.stage.texts = storeStage.texts;
    },
    editTransferInStore(state, action) {
      const storeStage = JSON.parse(JSON.stringify(state.stage));
      const { id, transfer } = action.payload;
      storeStage.transfers.splice(+id, 1, transfer);
      state.stage.transfers = storeStage.transfers;
    },
    newMethodInAction(state, action) {
      const storeStage = JSON.parse(JSON.stringify(state.stage));
      const typeMethod = action.payload || "add";
      const arrayActions: any = Object.entries(storeStage.actions);
      arrayActions.push([typeMethod, []]);
      storeStage.actions = Object.fromEntries(arrayActions);
      state.stage.actions = storeStage.actions;
    },
    newParamInMethod(state, action) {
      const storeStage = JSON.parse(JSON.stringify(state.stage));
      const { indexMethod, param }: { indexMethod: number; param: string } =
        action.payload;
      const arrayActions: any = Object.entries(storeStage.actions);
      arrayActions[indexMethod][1].push(param);
      storeStage.actions = Object.fromEntries(arrayActions);
      state.stage.actions = storeStage.actions;
    },
    editParamInAction(state, action) {
      const storeStage = JSON.parse(JSON.stringify(state.stage));
      const { editedParam, indexMethod, indexParam } = action.payload;
      const arrayActions: any = Object.entries(storeStage.actions);
      arrayActions[+indexMethod][1][+indexParam] = editedParam;
      storeStage.actions = Object.fromEntries(arrayActions);
      state.stage.actions = storeStage.actions;
    },
    deleteMethodInAction(state, action) {
      const storeStage = JSON.parse(JSON.stringify(state.stage));
      const { indexMethod } = action.payload;
      const arrayActions: any = Object.entries(storeStage.actions);
      arrayActions.splice(+indexMethod, 1);
      storeStage.actions = Object.fromEntries(arrayActions);
      state.stage.actions = storeStage.actions;
    },
    deleteParamInMethod(state, action) {
      const storeStage = JSON.parse(JSON.stringify(state.stage));
      const { indexMethod, indexParam } = action.payload;
      const arrayActions: any = Object.entries(storeStage.actions);
      arrayActions[+indexMethod][1].splice(+indexParam, 1);
      storeStage.actions = Object.fromEntries(arrayActions);
      state.stage.actions = storeStage.actions;
    },
    createConditionInTransfer(state, action) {
      const storeStage = JSON.parse(JSON.stringify(state.stage));
      const { transferIndex, typeCondition } = action.payload;
      switch (typeCondition) {
        case "has":
          storeStage.transfers[+transferIndex].condition = {
            ...storeStage.transfers[+transferIndex].condition,
            has: ["параметр"],
          };
          break;
        case "!has":
          storeStage.transfers[+transferIndex].condition = {
            ...storeStage.transfers[+transferIndex].condition,
            "!has": ["параметр"],
          };
          break;
        case "money>=":
          storeStage.transfers[+transferIndex].condition = {
            ...storeStage.transfers[+transferIndex].condition,
            "money>=": ["100"],
          };
          break;
      }
      state.stage.transfers = storeStage.transfers;
    },
    createValueInCondition(state, action) {
      const storeStage = JSON.parse(JSON.stringify(state.stage));
      const { transferIndex, conditionIndex } = action.payload;
      const conditions: any = Object.entries(
        storeStage.transfers[+transferIndex].condition
      );
      conditions[+conditionIndex][1].push("новый_параметр");
      state.stage.transfers = storeStage.transfers;
    },
    editValueInConditions(state, action) {
      const storeStage = JSON.parse(JSON.stringify(state.stage));
      const { transferIndex, conditionIndex, valueIndex, value } =
        action.payload;
      const conditions: any = Object.entries(
        storeStage.transfers[+transferIndex].condition
      );
      conditions[+conditionIndex][1][+valueIndex] = value;
      state.stage.transfers = storeStage.transfers;
    },
    deleteConditionInTransfer(state, action) {
      const storeStage = JSON.parse(JSON.stringify(state.stage));
      const { transferIndex, conditionIndex } = action.payload;
      const conditions: any = Object.entries(
        storeStage.transfers[+transferIndex].condition
      );
      conditions.splice(+conditionIndex, 1);

      storeStage.transfers[+transferIndex].condition =
        Object.fromEntries(conditions);
      state.stage.transfers = storeStage.transfers;
    },
    deleteValueInCondition(state, action) {
      const storeStage = JSON.parse(JSON.stringify(state.stage));
      const { transferIndex, conditionIndex, valueIndex } = action.payload;
      const conditions: any = Object.entries(
        storeStage.transfers[+transferIndex].condition
      );
      conditions[+conditionIndex][1].splice(+valueIndex, 1);
      state.stage.transfers = storeStage.transfers;
    },
    setConnection(state, action) {
      if (action.payload) {
        state.connection.source = action.payload.source;
        state.connection.target = action.payload.target;
      }
    },
    editPosInData(state, action) {
      if (state.stage.data) {
        state.stage.data.pos = action.payload;
      }
    },
    editMapInData(state, action) {
      if (state.stage.data) {
        state.stage.data.map = action.payload;
      }
    },
    setTransition(state, action) {
      state.transitionFromMap = action.payload;
    },
    editMapIdInTransition(state, action) {
      state.transitionFromMap.mapId = action.payload;
    },
    editPosInTransition(state, action) {
      state.transitionFromMap.point.pos = action.payload;
    },
    setTargetTransfer(state, action) {
      state.targetTransfer = action.payload;
    },
    setTransitionToStore(state, action) {
      state.transition = action.payload;
    },
  },
});

export const {
  setStageToStore,
  newTextInStore,
  newTransferInStore,
  editTitleInStore,
  editBackgroundInStore,
  editMessageInStore,
  editTextInStore,
  editTransferInStore,
  newMethodInAction,
  newParamInMethod,
  editParamInAction,
  deleteMethodInAction,
  deleteParamInMethod,
  createConditionInTransfer,
  createValueInCondition,
  editValueInConditions,
  deleteConditionInTransfer,
  deleteValueInCondition,
  setConnection,
  editPosInData,
  editMapInData,
  setTransition,
  editPosInTransition,
  editMapIdInTransition,
  setTargetTransfer,
  setTransitionToStore,
} = stageSlice.actions;

export default stageSlice.reducer;
