import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { stageText, stageTransfer, stageType } from "@/store/types/types";
import { pointType } from "@/store/types/mapType";

interface IOriginalPoint {
  point: pointType;
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
  targetText: {
    targetText: stageText;
    indexTargetText: number;
  };
  parameters: string[];
}

const initialState: IState = {
  transition: {
    point: {
      data: { stage: "", chapter: "" },
      id: "",
      condition: {},
      pos: "",
      name: "",
      type: 0,
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
  targetText: {
    targetText: {
      text: "",
      condition: {},
    },
    indexTargetText: 0,
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
      type: 0,
    },
    originalPoint: {
      mapId: "0",
      point: {
        data: { stage: "", chapter: "" },
        id: "",
        condition: {},
        pos: "",
        name: "",
        type: 0,
      },
    },
  },
  parameters: [""],
};

const stageSlice = createSlice({
  name: "stage",
  initialState,
  reducers: {
    setStageToStore(state, action) {
      state.stage = action.payload;
    },
    newTextInStore(state) {
      if (state.stage.texts) {
        state.stage.texts.push({ text: "Новый текст", condition: {} });
      }
    },
    deleteTextInStore(state, action) {
      state.stage.texts?.splice(action.payload, 1);
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
    setParameters(state, action) {
      state.parameters = action.payload;
    },
    editMessageInStore(state, action) {
      state.stage.message = action.payload;
    },
    editStageInStore(state, action) {
      state.stage = {
        ...state.stage,
        ...action.payload,
      };
    },
    editTextInStore(state, action) {
      const storeStage = JSON.parse(JSON.stringify(state.stage));
      const { id, text } = action.payload;
      storeStage.texts.splice(+id, 1, text);
      state.stage.texts = storeStage.texts;
    },
    deleteTransferInStore(state, action: PayloadAction<number>) {
      state.stage.transfers?.splice(action.payload, 1);
    },
    editTransferInStore(state, action) {
      const storeStage = JSON.parse(JSON.stringify(state.stage));
      const { id, transfer } = action.payload;
      storeStage.transfers.splice(+id, 1, transfer);
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
    editTransition(state, action) {
      state.transitionFromMap.point = {
        ...state.transitionFromMap.point,
        ...action.payload,
      };
    },
    setTargetTransfer(state, action) {
      state.targetTransfer = action.payload;
    },
    setTransitionToStore(state, action) {
      state.transition = action.payload;
    },
    setTargetText(state, action) {
      state.targetText = action.payload;
    },
    // CONDITION_TRANSFER
    editConditionInTransfer(state, action) {
      const { index, condition } = action.payload;
      state.stage.transfers![+index].condition = condition;
    },
    // CONDITION_TEXT
    editConditionInText(state, action) {
      const { index, condition } = action.payload;
      state.stage.texts![+index].condition = condition;
    },
    // CONDITION_POINT
    editConditionInPoint(state, action) {
      const { condition } = action.payload;
      state.transitionFromMap.point.condition = condition;
    },
    // ACTIONS
    editActions(state, action) {
      state.stage.actions = action.payload;
    },
  },
});

export const {
  setStageToStore,
  newTextInStore,
  deleteTextInStore,
  newTransferInStore,
  editTitleInStore,
  editBackgroundInStore,
  editMessageInStore,
  editTextInStore,
  editTransferInStore,
  setTargetText,
  setConnection,
  editPosInData,
  editMapInData,
  setTransition,
  editPosInTransition,
  editMapIdInTransition,
  setTargetTransfer,
  setTransitionToStore,
  setParameters,
  editConditionInText,
  editConditionInTransfer,
  editConditionInPoint,
  editActions,
  editStageInStore,
  deleteTransferInStore,
  editTransition,
} = stageSlice.actions;

export default stageSlice.reducer;
