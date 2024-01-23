import { useStoryStore } from "@/entities/story";
import { logger } from "@/store/utils/logger";
import { Button } from "@chakra-ui/react";
import { ChangeEvent, useRef } from "react";
import store from "store2";

const ImportFromFolderButton = () => {
  const { stories, setStories } = useStoryStore();

  const folderRef = useRef<HTMLInputElement>(null);

  const importFromFolder = async (e: ChangeEvent<HTMLInputElement>) => {
    const files: File[] = [...(e.target.files as unknown as File[])];
    logger.info("Start upload story from folder, files:", files);
    let idStory: number;

    const infoFile: File = files.find(
      (file: File) => file.name === "info.json"
    )!;

    const fileBase = new FileReader();
    fileBase.readAsText(infoFile);
    fileBase.onload = () => {
      idStory = +JSON.parse(fileBase.result as string).id;
      setStories([...stories, JSON.parse(fileBase.result as string)]);
      store.set(`story_${idStory}_info`, JSON.parse(fileBase.result as string));
    };

    files.forEach((file: File) => {
      const fileReader = new FileReader();
      fileReader.readAsText(file);

      fileReader.onload = () => {
        // if chapter
        if (file.name.includes("chapter")) {
          store.set(
            `story_${idStory}_chapter_${
              JSON.parse(fileReader.result as string).id
            }`,
            JSON.parse(fileReader.result as string)
          );
          // if map
        } else if (file.webkitRelativePath.includes("maps")) {
          store.set(
            `story_${idStory}_map_${
              JSON.parse(fileReader.result as string).id
            }`,
            JSON.parse(fileReader.result as string)
          );
        }
      };
    });
  };

  return (
    <>
      <input
        type="file"
        hidden
        ref={folderRef}
        {...{ directory: "", webkitdirectory: "" }}
        onChange={(e) => importFromFolder(e)}
      />
      <Button fontWeight="normal" onClick={() => folderRef?.current?.click()}>
        Загрузить из папки
      </Button>
    </>
  );
};

export { ImportFromFolderButton };
