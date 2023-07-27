import useFetching from "@/hooks/useFetching";
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
  Box,
  Select,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import store from "store2";

interface Props {
  stories: storyType[];
  setStories: (newStories: storyType[]) => void;
  downloadModalIsOpen: boolean;
  downloadModalOnClose: () => void;
}

const DownloadFromServerDrawer: React.FC<Props> = ({
  stories,
  setStories,
  downloadModalIsOpen,
  downloadModalOnClose,
}) => {
  const user = useAppSelector((state: any) => state.user.user);
  const [storiesFromServer, setStoriesFromServer] =
    useState<StoryFromServer[]>();
  const [type, setType] = useState("PUBLIC");

  const { data: types } = useFetching<string[]>(
    "/pdanetwork/api/v1/admin/quest/storage/types"
  );

  const downloadStoryFromServer = async (type: string) => {
    const storiesRes = await fetch(
      user?.role === "ADMIN"
        ? `https://dev.artux.net/pdanetwork/api/v1/admin/quest/storage/all?sortDirection=DESC&sortBy=timestamp&type=${type}`
        : `https://dev.artux.net/pdanetwork/api/v1/admin/quest/storage?sortDirection=DESC&sortBy=timestamp&type=${type}`,
      {
        headers: {
          Authorization: `Basic ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );

    const { content } = await storiesRes.json();
    setStoriesFromServer(content);
  };

  useEffect(() => {
    if (downloadModalIsOpen) {
      downloadStoryFromServer(type);
    }
  }, [downloadModalIsOpen, type]);

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
          <Box mb={2}>
            <Select value={type} onChange={(e) => setType(e.target.value)}>
              {types?.map((type) => (
                <option value={type} key={type}>
                  {type}
                </option>
              ))}
            </Select>
          </Box>
          <VStack>
            {stories.length === 0 && "Историй нет, пусто"}
            {storiesFromServer?.map((story: StoryFromServer) => (
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
