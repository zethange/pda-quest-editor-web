import { createEffect, createEvent, createStore, sample } from "effector";
import type { Story } from "@/entities/story";
import store from "@/store/utils/storage";
import { logger } from "@/store/utils/logger";

export interface UploadParameters {
  id: number;
  type: "PUBLIC" | "PRIVATE" | "COMMUNITY";
  toStore: boolean;
  message: string;
}

const initialUploadParameters: UploadParameters = {
  id: 0,
  type: "PUBLIC",
  toStore: false,
  message: "",
};

const readStoriesFromStorage = (): Story[] => {
  const neededStories: Story[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = store.get(key);
    if (key?.includes("info")) {
      neededStories.push(value as Story);
    }
  }
  neededStories.sort((a, b) => a.id - b.id);
  return neededStories;
};

export const homePageStarted = createEvent();
export const createStoryRequested = createEvent();
export const uploadParametersChanged = createEvent<Partial<UploadParameters>>();
export const uploadParametersReset = createEvent();
export const uploadTargetStorySelected = createEvent<number>();
export const editStoryStarted = createEvent<Story>();
export const editStoryChanged = createEvent<Story>();
export const checkUniqueIdRequested = createEvent<number>();
const uniqueIdChecked = createEvent<boolean>();
export const saveStoryRequested = createEvent();
export const deleteStoryRequested = createEvent<number>();
export const storiesReloadRequested = createEvent();

export const loadStoriesFx = createEffect(() => {
  logger.info("Editor started");
  const stories = readStoriesFromStorage();
  logger.success("Get stories from localStorage", stories);
  return stories;
});

export const createStoryFx = createEffect((stories: Story[]) => {
  let newStoryId = Math.max(...stories.map((story) => story.id)) + 1;
  if (newStoryId === -Infinity) {
    newStoryId = 0;
  }

  const nextStory: Story = {
    id: newStoryId,
    title: `Новая история ${stories.length}`,
    desc: "Описание",
    icon: `story/freeplay/screen/${Math.round(Math.random() * 40)}.jpg`,
    access: "USER",
  };
  logger.info(`Create story with id ${newStoryId}`);
  store.set(`story_${newStoryId}_info`, nextStory);
  return [...stories, nextStory];
});

export const saveStoryFx = createEffect(
  ({
    stories,
    editStory,
    openEditStoryId,
  }: {
    stories: Story[];
    editStory: Story | null;
    openEditStoryId: number;
  }) => {
    if (!editStory) {
      return stories;
    }

    const storiesCopy = [...stories];
    const indexEditedStory = storiesCopy.findIndex((story) => story.id === editStory.id);
    if (indexEditedStory !== -1) {
      storiesCopy.splice(indexEditedStory, 1, editStory);
    }

    if (editStory.id !== openEditStoryId) {
      const requriedUpdate: [string, string][] = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (
          key?.includes(`story_${openEditStoryId}_chapter`) ||
          key?.includes(`story_${openEditStoryId}_map`)
        ) {
          const keySplit = key.split("_");
          keySplit[1] = String(editStory.id);
          requriedUpdate.push([key, keySplit.join("_")]);
        }
        if (key === `story_${openEditStoryId}_info`) {
          store.set(`story_${editStory.id}_info`, editStory);
          store.remove(`story_${openEditStoryId}_info`);
        }
      }

      requriedUpdate.forEach(([from, to]) => {
        store.set(to, store.get(from));
        store.remove(from);
      });
      return storiesCopy;
    }

    store.set(`story_${editStory.id}_info`, editStory);
    return storiesCopy;
  }
);

export const deleteStoryFx = createEffect((storyId: number) => {
  const storyItems: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.includes(`story_${storyId}`)) {
      storyItems.push(key);
    }
  }

  storyItems.forEach((storyKey) => {
    store.remove(storyKey);
  });

  return readStoriesFromStorage();
});

export const $stories = createStore<Story[]>([])
  .on(loadStoriesFx.doneData, (_, stories) => stories)
  .on(createStoryFx.doneData, (_, stories) => stories)
  .on(saveStoryFx.doneData, (_, stories) => stories)
  .on(deleteStoryFx.doneData, (_, stories) => stories);

export const $editStory = createStore<Story | null>(null)
  .on(editStoryStarted, (_, story) => story)
  .on(editStoryChanged, (_, story) => story);

export const $openEditStoryId = createStore(0).on(
  editStoryStarted,
  (_, story) => story.id
);

export const $isErrorId = createStore(false).on(uniqueIdChecked, (_, value) => value);

export const $uploadParameters = createStore<UploadParameters>(initialUploadParameters)
  .on(uploadParametersChanged, (state, patch) => ({ ...state, ...patch }))
  .on(uploadParametersReset, () => initialUploadParameters)
  .on(uploadTargetStorySelected, (state, id) => ({ ...state, id }));

sample({ clock: homePageStarted, target: loadStoriesFx });
sample({ clock: storiesReloadRequested, target: loadStoriesFx });
sample({ clock: createStoryRequested, source: $stories, target: createStoryFx });
sample({
  clock: saveStoryRequested,
  source: { stories: $stories, editStory: $editStory, openEditStoryId: $openEditStoryId },
  target: saveStoryFx,
});
sample({ clock: deleteStoryRequested, target: deleteStoryFx });

sample({
  clock: checkUniqueIdRequested,
  source: { stories: $stories, openEditStoryId: $openEditStoryId },
  fn: ({ stories, openEditStoryId }, storyId) => {
    const allIds = stories.map((story) => story.id);
    const exists = allIds.includes(storyId);
    return exists && storyId !== openEditStoryId;
  },
  target: uniqueIdChecked,
});
