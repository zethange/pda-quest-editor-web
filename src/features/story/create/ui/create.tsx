import { useStoryStore } from "@/entities/story";
import { logger } from "@/store/utils/logger";
import { Button } from "@chakra-ui/react";
import store from "store2";

const CreateStoryButton = () => {
  const { stories, setStories } = useStoryStore();

  const createStory = () => {
    let newStoryId = Math.max(...stories.map((story) => story.id)) + 1;
    if (newStoryId === -Infinity) {
      newStoryId = 0;
    }
    const infoJSON = {
      id: newStoryId,
      title: `Новая история ${stories.length}`,
      desc: "Описание",
      icon: `story/freeplay/screen/${Math.round(Math.random() * 40)}.jpg`,
      access: "USER",
    };

    logger.info("Create story with id " + newStoryId);
    setStories([...stories, infoJSON]);
    store.set(`story_${newStoryId}_info`, infoJSON);
  };

  return (
    <Button fontWeight="normal" onClick={() => createStory()}>
      Создать историю
    </Button>
  );
};

export { CreateStoryButton };
