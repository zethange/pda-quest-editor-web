import { useCoopStore } from "@/entities/cooperative";
import {
  Button,
  Card,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";

export interface SharedStoriesDrawerProps {}

const SharedStoriesDrawer: FC<SharedStoriesDrawerProps> = ({}) => {
  const { ws, id, handleMessage, setSharedStories, sharedStories } =
    useCoopStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const getData = async () => {};
    getData().then();

    const interval = setInterval(() => {
      if (!isOpen) return;
      ws?.send(JSON.stringify({ id: id, type: "GET_SHARED_STORIES" }));
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  useEffect(() => {
    handleMessage((e) => {
      const data = JSON.parse((e as MessageEvent).data);

      if (data.type === "SHARED_STORIES") {
        setSharedStories(data.sharedStories);
      }
    });
  }, []);

  const requestAccess = (storyId: string) => {
    ws?.send(
      JSON.stringify({
        id: id,
        type: "REQUEST_ACCESS",
        requestAccess: {
          storyId,
        },
      })
    );
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} fontWeight="normal">
        Расшаренные истории
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        size="md"
        onClose={() => setIsOpen(false)}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Расшаренные истории</DrawerHeader>

          <DrawerBody>
            <VStack gap={1}>
              {sharedStories.map((story) => (
                <Card variant="outline" key={story.id} p={2} w="100%">
                  <Text fontWeight="bold">{story.story.title}</Text>
                  <Text>{story.story.desc}</Text>
                  <Text>Shared by: {story.owner.login}</Text>
                  <Button
                    mt={1}
                    variant="outline"
                    onClick={() => requestAccess(story.id)}
                  >
                    Запросить доступ
                  </Button>
                </Card>
              ))}
            </VStack>
          </DrawerBody>

          <DrawerFooter>
            <Button onClick={() => setIsOpen(false)}>Закрыть</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export { SharedStoriesDrawer };
