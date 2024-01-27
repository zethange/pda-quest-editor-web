import { useChapterStore } from "@/entities/chapter";
import { useCoopStore } from "@/entities/cooperative";
import { Button, useToast } from "@chakra-ui/react";
import { useState } from "react";

const ShareStoryButton = () => {
  const { storyId, chapters } = useChapterStore();
  const { ws, id, handleMessage } = useCoopStore();
  const [shared, setShared] = useState<boolean>(false);

  const toast = useToast();
  return (
    <Button
      fontWeight="normal"
      isDisabled={shared}
      onClick={() => {
        ws!.send(
          JSON.stringify({
            id: id,
            type: "SHARE_STORY",
            shareStory: {
              story: JSON.parse(
                localStorage.getItem(`story_${storyId}_info`) as string
              ),
              chapters,
            },
          })
        );
        handleMessage((e) => {
          const data = JSON.parse((e as MessageEvent).data);
          console.log(data);
          if (data.type === "SHARE_STORY") {
            if (data.shareStory.ok) {
              toast({
                title: "История расшарена",
                status: "success",
                description: `ID истории: ${data.shareStory.id}`,
              });
              setShared(true);
            } else {
              toast({
                title: "Произошла ошибка",
                status: "error",
                description: data.shareStory.data,
              });
            }
          }
        });
      }}
    >
      {!shared ? "Share" : "Shared"}
    </Button>
  );
};

export { ShareStoryButton };
