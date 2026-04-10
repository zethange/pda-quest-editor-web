import { createEvent, createStore, sample } from "effector";
import {
  buildChapterTree,
  createTreeFolder,
  getTreeNode,
  type Chapter as chapterType,
  type TreeNode,
} from "@/entities/chapter";
import store from "@/store/utils/storage";
import { newChapter } from "@/store/tools/createTools";

type StoryOpenedPayload = {
  storyId: string;
  path: string;
};

type UploadChapterPayload = {
  storyId: string;
  path: string;
  chapter: chapterType;
};

const emptyTree: TreeNode = {
  path: "",
  children: {},
  chapters: [],
};

export const storyPageOpened = createEvent<StoryOpenedPayload>();
export const folderCreated = createEvent<string>();
export const chapterCreateRequested = createEvent();
export const chapterCreated = createEvent<chapterType>();
export const chapterDeleted = createEvent<number>();
export const chapterUploaded = createEvent<UploadChapterPayload>();
export const openChapterChanged = createEvent<chapterType | null>();
export const openChapterPatched = createEvent<Partial<chapterType>>();
export const openChapterSaved = createEvent();

export const $storyId = createStore("");
export const $path = createStore("");
export const $chapters = createStore<chapterType[]>([]);
export const $folders = createStore<TreeNode>(emptyTree);
export const $selectedFolder = createStore<chapterType[]>([]);
export const $openChapter = createStore<chapterType | null>(null);

sample({
  clock: storyPageOpened,
  fn: ({ storyId }) => storyId,
  target: $storyId,
});

sample({
  clock: storyPageOpened,
  fn: ({ path }) => path,
  target: $path,
});

sample({
  clock: storyPageOpened,
  fn: ({ storyId }) => {
    const chapters: chapterType[] = [];
    store.each((key, value) => {
      if (key.includes(`story_${storyId}_chapter`)) {
        chapters.push(value as chapterType);
      }
      if (key === "stopLoop") return false;
    });
    chapters.sort((a, b) => a.id - b.id);
    return chapters;
  },
  target: $chapters,
});

sample({
  clock: $chapters,
  fn: (chapters) => buildChapterTree(chapters),
  target: $folders,
});

sample({
  source: { path: $path, folders: $folders },
  clock: [$path, $folders],
  fn: ({ path, folders }) => getTreeNode(path, folders).chapters || [],
  target: $selectedFolder,
});

sample({
  source: { folders: $folders, path: $path },
  clock: folderCreated,
  fn: ({ folders }, path) => createTreeFolder(path, folders),
  target: $folders,
});

sample({
  source: { chapters: $chapters, path: $path },
  clock: chapterCreateRequested,
  fn: ({ chapters, path }) => {
    let newId = Math.max(...chapters.map((chapter) => +chapter.id)) + 1;
    if (newId === -Infinity) newId = 0;
    return newChapter(String(newId), path);
  },
  target: chapterCreated,
});

$chapters.on(chapterDeleted, (chapters, chapterId) =>
  chapters.filter((chapter) => chapter.id !== chapterId)
);

sample({
  source: $storyId,
  clock: chapterDeleted,
  fn: (storyId, chapterId) => ({ storyId, chapterId }),
}).watch(({ storyId, chapterId }) => {
  store.remove(`story_${storyId}_chapter_${chapterId}`);
});

$chapters.on(chapterUploaded, (chapters, payload) => {
  let newId = Math.max(...chapters.map((chapter) => +chapter.id)) + 1;
  if (newId === -Infinity) newId = 0;
  const nextChapter = { ...payload.chapter, id: newId, catalog: payload.path };
  return [...chapters, nextChapter];
});
$chapters.on(chapterCreated, (chapters, chapter) => [...chapters, chapter]);

sample({
  source: { storyId: $storyId, chapters: $chapters },
  clock: chapterUploaded,
  fn: ({ storyId, chapters }) => ({ storyId, chapter: chapters.at(-1) }),
}).watch(({ storyId, chapter }) => {
  if (chapter) {
    store.set(`story_${storyId}_chapter_${chapter.id}`, chapter);
  }
});

sample({
  source: { storyId: $storyId },
  clock: chapterCreated,
  fn: ({ storyId }, chapter) => ({ storyId, chapter }),
}).watch(({ storyId, chapter }) => {
  store.set(`story_${storyId}_chapter_${chapter.id}`, chapter);
});

$openChapter.on(openChapterChanged, (_, chapter) => chapter);
$openChapter.on(openChapterPatched, (chapter, patch) => {
  if (!chapter) return chapter;
  return { ...chapter, ...patch };
});

sample({
  source: { storyId: $storyId, chapter: $openChapter },
  clock: openChapterSaved,
}).watch(({ storyId, chapter }) => {
  if (!chapter) return;
  localStorage.setItem(`story_${storyId}_chapter_${chapter.id}`, JSON.stringify(chapter));
  window.location.reload();
});
