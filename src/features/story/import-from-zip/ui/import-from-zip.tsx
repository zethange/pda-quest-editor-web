import { useStoryStore } from "@/entities/story";
import { chapterType } from "@/store/types/story/chapterType";
import { mapType } from "@/store/types/story/mapType";
import { logger } from "@/shared/lib/logger.ts";
import { Button } from "@chakra-ui/react";
import JSZip from "jszip";
import { ChangeEvent, useRef } from "react";
import store from "store2";

const ImportFromZipButton = () => {
  const { stories, setStories } = useStoryStore();
  const zipRef = useRef<HTMLInputElement>(null);

  const importFromZip = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const zipFile = e.target.files[0];
    logger.info("Start zip file uploading:", zipFile);

    const zip = new JSZip();

    let newStoryId = Math.max(...stories.map((story) => story.id)) + 1;
    if (newStoryId === -Infinity) newStoryId = 0;
    logger.info("storyid:", newStoryId);

    const file = zip.loadAsync(zipFile);

    file
      .then((zip) => {
        zip.forEach(function (relativePath, zipEntry) {
          if (!zipEntry.dir) {
            zipEntry.async("string").then((fileData) => {
              const data = JSON.parse(fileData);

              if (relativePath.includes("info")) {
                const story = {
                  ...data,
                  id: newStoryId,
                };
                setStories([...stories, story]);
                store.set(`story_${newStoryId}_info`, story);
              } else if (relativePath.includes("chapter")) {
                store.set(
                  `story_${newStoryId}_chapter_${(data as chapterType).id}`,
                  data
                );
              } else if (relativePath.includes("maps")) {
                store.set(
                  `story_${newStoryId}_maps_${(data as mapType).id}`,
                  data
                );
              }
            });
          }
        });
      })
      .catch((error) => {
        logger.error("Ошибка при распаковке ZIP-файла:", error);
      });
  };

  return (
    <>
      <input
        type="file"
        id="input"
        accept="application/zip"
        ref={zipRef}
        hidden
        onChange={(e) => importFromZip(e)}
      />
      <Button fontWeight="normal" onClick={() => zipRef?.current?.click()}>
        Загрузить из .zip
      </Button>
    </>
  );
};

export { ImportFromZipButton };
