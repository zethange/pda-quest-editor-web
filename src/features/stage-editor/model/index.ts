import { createEvent, createStore } from "effector";
import type { Stage, StageText, StageTransfer } from "@/entities/chapter";
import type { MapEntity, QuestPoint } from "@/entities/map";

interface IOriginalPoint {
  point: QuestPoint;
  mapId: `${number}`;
}

interface TransitionFromMap {
  id: number;
  mapId: `${number}`;
  originalPoint: IOriginalPoint;
  point: QuestPoint;
}

interface TargetTransferState {
  targetTransfer: StageTransfer;
  indexTargetTransfer: number;
}

interface TargetTextState {
  targetText: StageText;
  indexTargetText: number;
}

interface TransitionState {
  point: QuestPoint;
  targetStage: Stage;
}

interface ConnectionState {
  source: number;
  target: number;
  indexCreatedTransfer: number;
}

const emptyPoint: QuestPoint = {
  data: { stage: "", chapter: "" },
  id: "",
  condition: {},
  pos: "",
  name: "",
  type: 0,
};

const emptyStage: Stage = {
  id: 0,
  type_stage: 0,
  background: "",
  title: "",
  message: "",
  type_message: 0,
  texts: [{ text: "", condition: {} }],
  transfers: [],
  data: { pos: "", map: "" },
  actions: {},
};

export const $stage = createStore<Stage | null>(emptyStage);
export const $maps = createStore<MapEntity[]>([]);
export const $parameters = createStore<string[]>([""]);
export const $connection = createStore<ConnectionState>({
  source: 0,
  target: 0,
  indexCreatedTransfer: 0,
});
export const $targetTransfer = createStore<TargetTransferState>({
  targetTransfer: { text: "", condition: {}, stage: 0 },
  indexTargetTransfer: 0,
});
export const $targetText = createStore<TargetTextState>({
  targetText: { text: "", condition: {} },
  indexTargetText: 0,
});
export const $transition = createStore<TransitionState>({
  point: emptyPoint,
  targetStage: emptyStage,
});
export const $transitionFromMap = createStore<TransitionFromMap | null>({
  id: 0,
  mapId: "0",
  point: emptyPoint,
  originalPoint: { mapId: "0", point: emptyPoint },
});

export const setMaps = createEvent<MapEntity>();
export const setStageToStore = createEvent<Stage | null>();
export const newTextInStore = createEvent();
export const deleteTextInStore = createEvent<number>();
export const newTransferInStore = createEvent<StageTransfer>();
export const editStageInStore = createEvent<Partial<Stage>>();
export const editTextInStore = createEvent<{ id: number; text: StageText }>();
export const deleteTransferInStore = createEvent<number>();
export const editTransferInStore = createEvent<{
  id: number;
  transfer: StageTransfer;
}>();
export const setConnection = createEvent<{
  source: number;
  target: number;
} | null>();
export const editPosInData = createEvent<string>();
export const editMapInData = createEvent<string>();
export const setTransition = createEvent<TransitionFromMap | null>();
export const editMapIdInTransition = createEvent<`${number}`>();
export const editPosInTransition = createEvent<string>();
export const editTransition = createEvent<Partial<QuestPoint>>();
export const setTargetTransfer = createEvent<TargetTransferState | StageTransfer | null>();
export const setTransitionToStore = createEvent<TransitionState>();
export const setParameters = createEvent<string[]>();
export const setTargetText = createEvent<TargetTextState>();
export const editConditionInText = createEvent<{
  condition: Record<string, string[]>;
}>();
export const editConditionInTransfer = createEvent<{
  index: number;
  condition: Record<string, string[]>;
}>();
export const editConditionInPoint = createEvent<{
  condition: Record<string, string[]>;
}>();
export const editActions = createEvent<Record<string, string[]>>();

$maps.on(setMaps, (state, map) => {
  if (state.find((item) => +item.id === +map.id)) return state;
  return [...state, map];
});

$stage
  .on(setStageToStore, (_, stage) => stage)
  .on(newTextInStore, (stage) => ({
    ...stage,
    texts: [...(stage?.texts ?? []), { text: "Новый текст", condition: {} }],
  }))
  .on(deleteTextInStore, (stage, index) => ({
    ...stage,
    texts: (stage?.texts ?? []).filter((_, idx) => idx !== index),
  }))
  .on(newTransferInStore, (stage, transfer) => {
    const transfers = [...(stage?.transfers ?? [])];
    const index = transfers.findIndex((item) => item.stage === transfer.stage);
    if (index === -1) {
      transfers.push(transfer);
    } else {
      transfers.splice(index, 1, transfer);
    }
    return { ...stage, transfers };
  })
  .on(editStageInStore, (stage, patch) => ({ ...stage, ...patch }))
  .on(editTextInStore, (stage, { id, text }) => {
    const texts = [...(stage?.texts ?? [])];
    texts.splice(id, 1, text);
    return { ...stage, texts };
  })
  .on(deleteTransferInStore, (stage, index) => {
    const transfers = [...(stage?.transfers ?? [])];
    transfers.splice(index, 1);
    return { ...stage, transfers };
  })
  .on(editTransferInStore, (stage, { id, transfer }) => {
    const transfers = [...(stage?.transfers ?? [])];
    transfers.splice(id, 1, transfer);
    return { ...stage, transfers };
  })
  .on(editPosInData, (stage, pos) => ({
    ...stage,
    data: { ...(stage?.data ?? { map: "", pos: "" }), pos },
  }))
  .on(editMapInData, (stage, map) => ({
    ...stage,
    data: { ...(stage?.data ?? { map: "", pos: "" }), map },
  }))
  .on(editConditionInTransfer, (stage, { index, condition }) => {
    const transfers = [...(stage?.transfers ?? [])];
    const current = transfers[index];
    if (!current) return stage;
    transfers.splice(index, 1, { ...current, condition });
    return { ...stage, transfers };
  })
  .on(editConditionInText, (stage, { condition }) => {
    const texts = [...(stage?.texts ?? [])];
    const index = $targetText.getState().indexTargetText;
    const current = texts[index];
    if (!current) return stage;
    texts.splice(index, 1, { ...current, condition });
    return { ...stage, texts };
  })
  .on(editActions, (stage, actions) => ({ ...stage, actions }));

$connection
  .on(setConnection, (state, payload) =>
    payload
      ? { ...state, source: payload.source, target: payload.target }
      : state
  )
  .on(newTransferInStore, (state, transfer) => {
    const indexCreatedTransfer = ($stage.getState().transfers ?? []).findIndex(
      (item) => item.stage === transfer.stage
    );
    return { ...state, indexCreatedTransfer: Math.max(indexCreatedTransfer, 0) };
  });

$transitionFromMap
  .on(setTransition, (_, payload) => payload)
  .on(editMapIdInTransition, (state, mapId) => ({ ...state, mapId }))
  .on(editPosInTransition, (state, pos) => ({
    ...state,
    point: { ...state.point, pos },
  }))
  .on(editTransition, (state, patch) => ({
    ...state,
    point: { ...state.point, ...patch },
  }))
  .on(editConditionInPoint, (state, { condition }) => ({
    ...state,
    point: { ...state.point, condition },
  }));

$targetTransfer.on(setTargetTransfer, (_, state) => {
  if (!state) {
    return {
      targetTransfer: { text: "", condition: {}, stage: 0 },
      indexTargetTransfer: 0,
    };
  }
  if ("targetTransfer" in state) {
    return state;
  }
  return { targetTransfer: state, indexTargetTransfer: 0 };
});
$transition.on(setTransitionToStore, (_, state) => state);
$targetText.on(setTargetText, (_, state) => state);
$parameters.on(setParameters, (_, parameters) => parameters);
