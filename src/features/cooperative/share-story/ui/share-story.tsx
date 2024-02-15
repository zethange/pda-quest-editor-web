import { useChapterStore } from "@/entities/chapter";
import { useCoopStore } from "@/entities/cooperative";
import { shareStory } from "@/shared/api";
import { StoryType } from "@/shared/lib/type/story.type";
import { IconButton, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { FiShare2 } from "react-icons/fi";

const ShareStoryButton = () => {
  const { storyId, chapters } = useChapterStore();
  const [shared, setShared] = useState<boolean>(false);
  const { id } = useCoopStore();

  const toast = useToast();
  return (
    <IconButton
      fontWeight="normal"
      isDisabled={shared}
      onClick={() => {
        (async () => {
          const story = JSON.parse(
            localStorage.getItem(`story_${storyId}_info`) as string
          ) as StoryType;
          const data = await shareStory(
            {
              ...story,
              chapters,
            },
            id
          );

          setShared(data.ok);

          if (data.ok) {
            toast({
              title: "История расшарена",
              description: data.msg,
              status: "success",
              duration: 9000,
              isClosable: true,
            });
          } else {
            toast({
              title: "Ошибка",
              description: data.msg,
              status: "error",
              duration: 9000,
              isClosable: true,
            });
          }
        })();
      }}
      icon={<FiShare2 />}
      disabled={shared}
      aria-label="Share"
    />
  );
};

export { ShareStoryButton };
