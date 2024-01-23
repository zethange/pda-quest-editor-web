import { logger } from "@/store/utils/logger";
import { downloadZip } from "client-zip";
import store from "store2";

const useStoryService = () => ({
  downloadStoryAsZip: async (storyId: number) => {
    const info = {
      name: "info.json",
      lastModified: new Date(),
      input: JSON.stringify(store.get(`story_${storyId}_info`), null, 2),
    };
    logger.info(`Start download story with id ${storyId}`);

    // TODO: Refactor
    const arrChapters: any[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      const value = store.get(key);
      if (key?.includes(`story_${storyId}_chapter`)) {
        arrChapters.push({
          name: `chapter_${key?.split("_")[3]}.json`,
          lastModified: new Date(),
          input: JSON.stringify(value, null, 2),
        });
      } else if (key?.includes(`story_${storyId}_map`)) {
        arrChapters.push({
          name: `maps/${value.id}_${
            value?.tmx?.split(".")[0] || undefined
          }.json`,
          lastModified: new Date(),
          input: JSON.stringify(value, null, 2),
        });
      }
    }
    logger.info(`Getted chapters:`, arrChapters);

    const blob = await downloadZip([info, ...arrChapters]).blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);

    const dateString = new Date().toLocaleDateString();
    const timeString =
      new Date().getHours() +
      "." +
      new Date().getMinutes() +
      "." +
      new Date().getSeconds();
    link.download = `story_${storyId}_${dateString}_${timeString}.zip`;
    link.click();
    link.remove();
  },

  deleteStory: (storyId: number) => {
    const storyItems: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      if (key?.includes(`story_${storyId}`)) {
        storyItems.push(key!);
      }
    }

    storyItems.forEach((storyKey) => {
      store.remove(storyKey);
    });
    location.reload();
  },
});

export { useStoryService };
