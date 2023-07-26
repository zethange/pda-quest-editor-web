import { StoryFromServer } from "@/pages";
import { useAppSelector } from "@/store/reduxHooks";
import { mapType } from "@/store/types/mapType";
import { storyType } from "@/store/types/storyType";
import { chapterType } from "@/store/types/types";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  VStack,
  Card,
  Heading,
  Badge,
  CardBody,
  Button,
  DrawerFooter,
  Text,
} from "@chakra-ui/react";
import React from "react";
import store from "store2";

interface Props {
  stories: storyType[];
  setStories: (newStories: storyType[]) => void;
  storiesFromServer: StoryFromServer[];
  downloadModalIsOpen: boolean;
  downloadModalOnClose: () => void;
}

const DownloadFromServerDrawer: React.FC<Props> = ({
  stories,
  setStories,
  storiesFromServer,
  downloadModalIsOpen,
  downloadModalOnClose,
}) => {
  const user = useAppSelector((state) => state.user.user);
  const downloadStoryFromServerById = async (id: string) => {
    const res = await fetch(
      `https://dev.artux.net/pdanetwork/api/v1/admin/quest/storage/${id}`,
      {
        headers: {
          Authorization: `Basic ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await res.json();
    store.set(
      `story_${data.id}_info`,
      {
        id: data.id,
        title: data.title,
        desc: data.desc,
        icon: data.icon,
        needs: data.needs,
        access: data.access,
      },
      true
    );
    data.chapters.map((chapter: chapterType) => {
      store.set(`story_${data.id}_chapter_${chapter.id}`, chapter, true);
    });
    data.maps.map((map: mapType) => {
      store.set(`story_${data.id}_maps_${map.id}`, map, true);
    });
    setStories([...stories, data]);
  };

  return (
    <Drawer
      isOpen={downloadModalIsOpen}
      placement="right"
      size="md"
      onClose={downloadModalOnClose}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Загрузка истории с сервера</DrawerHeader>
        <DrawerBody>
          Роль: {user?.role}
          <VStack>
            {stories.length === 0 && "Историй нет, пусто"}
            {storiesFromServer.map((story: StoryFromServer) => (
              <Card key={story.storageId} w="100%" variant="outline">
                <Heading size="md" pt={5} pl={5}>
                  {story.title}{" "}
                  {story.archive && <Badge colorScheme="red">В архиве</Badge>}
                </Heading>
                <CardBody>
                  <Text>
                    Загружено: {new Date(story.timestamp).toLocaleString()}
                  </Text>
                  {story.message && <Text>Сообщение: {story.message}</Text>}
                  <Text>Тип: {story.type}</Text>
                  <Text>Загрузил: {story.author.login}</Text>
                  <Button
                    w="100%"
                    mt={2}
                    onClick={() => {
                      downloadStoryFromServerById(story.storageId);
                      downloadModalOnClose();
                    }}
                  >
                    Выгрузить
                  </Button>
                </CardBody>
              </Card>
            ))}
          </VStack>
        </DrawerBody>

        <DrawerFooter>
          <Button variant="outline" onClick={downloadModalOnClose}>
            Закрыть
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default DownloadFromServerDrawer;
