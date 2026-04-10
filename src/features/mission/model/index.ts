import { createEvent, createStore, sample } from "effector";
import type { Mission, MissionCheckpoint } from "@/entities/mission";
import storage from "@/store/utils/storage";

type TargetMissionState = {
  targetMission: Mission;
  targetMissionIndex: number;
  isOpen: boolean;
  targetCheckpoint: number;
};

const emptyMission: Mission = {
  name: "",
  title: "",
  checkpoints: [],
};

const defaultTargetMission: TargetMissionState = {
  targetMission: emptyMission,
  targetMissionIndex: 0,
  targetCheckpoint: 0,
  isOpen: false,
};

export const missionsLoaded = createEvent<Mission[]>();
export const missionSelected = createEvent<{ targetMission: Mission; targetMissionIndex: number }>();
export const missionCreated = createEvent<Mission>();
export const missionDeleted = createEvent<number>();
export const missionEdited = createEvent<Partial<Mission>>();
export const checkpointAdded = createEvent();
export const checkpointEdited = createEvent<{ index: number; checkpoint: Partial<MissionCheckpoint> }>();
export const checkpointDeleted = createEvent<number>();
export const targetCheckpointSelected = createEvent<number>();
export const checkpointConditionEdited = createEvent<{
  index: number;
  condition: Record<string, string[]>;
}>();
export const checkpointActionsEdited = createEvent<{
  index: number;
  actions: Record<string, string[]>;
}>();
export const missionsPersistRequested = createEvent<{ storyId: string; chapterId: string }>();

export const $missions = createStore<Mission[]>([])
  .on(missionsLoaded, (_, missions) => missions)
  .on(missionCreated, (missions, mission) => [...missions, mission])
  .on(missionDeleted, (missions, index) => missions.filter((_, i) => i !== index))
  .on(missionEdited, (missions, patch) =>
    missions.map((mission, index) =>
      index === $targetMission.getState().targetMissionIndex ? { ...mission, ...patch } : mission
    )
  )
  .on(checkpointAdded, (missions) =>
    missions.map((mission, index) =>
      index === $targetMission.getState().targetMissionIndex
        ? {
            ...mission,
            checkpoints: [
              ...mission.checkpoints,
              {
                title: "Новый чекпоинт",
                parameter: "...",
                type: ["FIND_ITEM", "KILL", "TRAVEL"],
                condition: {},
                actions: {},
              },
            ],
          }
        : mission
    )
  )
  .on(checkpointEdited, (missions, { index, checkpoint }) =>
    missions.map((mission, missionIndex) =>
      missionIndex === $targetMission.getState().targetMissionIndex
        ? {
            ...mission,
            checkpoints: mission.checkpoints.map((item, checkpointIndex) =>
              checkpointIndex === index ? ({ ...item, ...checkpoint } as MissionCheckpoint) : item
            ),
          }
        : mission
    )
  )
  .on(checkpointDeleted, (missions, index) =>
    missions.map((mission, missionIndex) =>
      missionIndex === $targetMission.getState().targetMissionIndex
        ? { ...mission, checkpoints: mission.checkpoints.filter((_, checkpointIndex) => checkpointIndex !== index) }
        : mission
    )
  )
  .on(checkpointConditionEdited, (missions, { index, condition }) =>
    missions.map((mission, missionIndex) =>
      missionIndex === $targetMission.getState().targetMissionIndex
        ? {
            ...mission,
            checkpoints: mission.checkpoints.map((item, checkpointIndex) =>
              checkpointIndex === index ? { ...item, condition } : item
            ),
          }
        : mission
    )
  )
  .on(checkpointActionsEdited, (missions, { index, actions }) =>
    missions.map((mission, missionIndex) =>
      missionIndex === $targetMission.getState().targetMissionIndex
        ? {
            ...mission,
            checkpoints: mission.checkpoints.map((item, checkpointIndex) =>
              checkpointIndex === index ? { ...item, actions } : item
            ),
          }
        : mission
    )
  );

export const $targetMission = createStore<TargetMissionState>(defaultTargetMission)
  .on(missionSelected, (_, payload) => ({
    ...payload,
    isOpen: true,
    targetCheckpoint: 0,
  }))
  .on(targetCheckpointSelected, (state, targetCheckpoint) => ({ ...state, targetCheckpoint }))
  .on(missionDeleted, (state) => ({ ...state, isOpen: false }))
  .on(missionEdited, (state, patch) => ({ ...state, targetMission: { ...state.targetMission, ...patch } }))
  .on(checkpointAdded, (state) => ({
    ...state,
    targetMission: $missions.getState()[$targetMission.getState().targetMissionIndex] ?? state.targetMission,
  }))
  .on(checkpointEdited, (state) => ({
    ...state,
    targetMission: $missions.getState()[$targetMission.getState().targetMissionIndex] ?? state.targetMission,
  }))
  .on(checkpointDeleted, (state) => ({
    ...state,
    targetMission: $missions.getState()[$targetMission.getState().targetMissionIndex] ?? state.targetMission,
  }))
  .on(checkpointConditionEdited, (state) => ({
    ...state,
    targetMission: $missions.getState()[$targetMission.getState().targetMissionIndex] ?? state.targetMission,
  }))
  .on(checkpointActionsEdited, (state) => ({
    ...state,
    targetMission: $missions.getState()[$targetMission.getState().targetMissionIndex] ?? state.targetMission,
  }));

sample({
  source: $missions,
  clock: missionsPersistRequested,
  fn: (missions, payload) => ({ ...payload, missions }),
}).watch(({ storyId, chapterId, missions }) => {
  const key = `story_${storyId}_chapter_${chapterId}`;
  const sourceChapter = storage.get(key);
  storage.set(key, { ...sourceChapter, missions });
});
