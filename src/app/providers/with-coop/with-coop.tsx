import { useCoopStore } from "@/entities/cooperative";
import { useStoryStore } from "@/entities/story";
import { AlertOnRequest } from "@/features/cooperative";
import { COOPERATIVE_URL } from "@/shared/config";
import { logger } from "@/shared/lib/logger";
import { ChapterType } from "@/shared/lib/type/chapter.type";
import { useToast } from "@chakra-ui/react";
import { FC, ReactNode, useEffect } from "react";

export interface WithCoopProps {
  children: ReactNode;
}

const WithCoop: FC<WithCoopProps> = ({ children }) => {
  const { ws, handleMessage, setId, setWs } = useCoopStore();
  const { stories, setStories } = useStoryStore();
  const toast = useToast();

  useEffect(() => {
    if (ws) return;

    const wss = new WebSocket(COOPERATIVE_URL);
    wss.onopen = () => {
      logger.info("Connected to server");
    };
    wss.onclose = () => {
      logger.info("Disconnected from server");
    };
    handleMessage((e) => {
      const data = JSON.parse((e as MessageEvent).data);

      if (data.type === "CONNECT") {
        logger.info("Granted id:", data.connect.id);
        setId(data.connect.id);
      } else if (data.type === "ANSWER_REQUEST") {
        if (data.answerRequest.allow) {
          toast({
            status: "success",
            title: "Доступ предоставлен",
            description: `Админ предоставил доступ к истории '${data.answerRequest.story.title}'`,
          });
          const { chapters, story } = data.answerRequest;
          localStorage.setItem(`story_${story.id}_info`, JSON.stringify(story));
          chapters.forEach((chapter: ChapterType) => {
            localStorage.setItem(
              `story_${story.id}_chapter_${chapter.id}`,
              JSON.stringify(chapter)
            );
          });

          setStories([...stories, story]);
        } else {
          toast({
            status: "error",
            title: "Доступ не предоставлен",
            description: `Админ отказался предоставить доступ к истории`,
          });
        }
      }
      logger.info("Message received:", data);
    });
    setWs(wss);
  }, []);
  return (
    <>
      <AlertOnRequest />
      {children}
    </>
  );
};

export default WithCoop;
