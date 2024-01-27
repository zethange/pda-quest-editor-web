import { useCoopStore } from "@/entities/cooperative";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";

export interface SharedStoriesDrawerProps {}

const SharedStoriesDrawer: FC<SharedStoriesDrawerProps> = ({}) => {
  const { ws, id, handleMessage, setSharedStories, sharedStories } =
    useCoopStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
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

          <DrawerBody>{JSON.stringify(sharedStories)}</DrawerBody>

          <DrawerFooter>
            <Button onClick={() => setIsOpen(false)}>Закрыть</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export { SharedStoriesDrawer };
