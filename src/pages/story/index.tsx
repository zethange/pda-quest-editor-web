import { logger } from "@/shared/lib/logger.ts";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import store from "store2";

import CustomHead from "@/components/Global/CustomHead";
import ChangeThemeButton from "@/components/UI/NavBar/ChangeThemeButton";
import NavBar from "@/components/UI/NavBar/NavBar";
import { useStoryService, useStoryStore } from "@/entities/story";
import {
  CreateStoryButton,
  EditStoryDrawer,
  ImportFromFolderButton,
  ImportFromServerButton,
  ImportFromZipButton,
} from "@/features/story";
import { StoryType } from "@/shared/lib/type/story.type";
import { storyType } from "@/store/types/story/storyType";
import ExportToServer from "@/features/story/export-to-server/ui/export-to-server.tsx";
import { SharedStoriesDrawer } from "@/features/cooperative/get-shared-stories";
import {
  Box,
  Button,
  Card,
  Heading,
  Icon,
  SimpleGrid,
  Spacer,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { BiEdit } from "react-icons/bi";
import { BsCloudUpload } from "react-icons/bs";

interface Author {
  id: string;
  login: string;
  name: string;
  nickname: string;
  avatar: string;
  pdaId: number;
  xp: number;
  achievements: number;
  gang: string;
  registration: string;
  lastLoginAt: string;
}

export interface StoryFromServer {
  storageId: string;
  storyId: number;
  title: string;
  icon: string;
  needs: number[];
  access: string;
  message: string;
  archive: boolean;
  type: string;
  timestamp: string;
  author: Author;
  hashcode: number;
}

const Home = () => {
  const { stories, setStories, setEditStory, setUploadConfig } =
    useStoryStore();
  const { downloadStoryAsZip } = useStoryService();
  const {
    isOpen: editDrawerIsOpen,
    onOpen: editDrawerOnOpen,
    onClose: editDrawerOnClose,
  } = useDisclosure();

  const {
    isOpen: exportDrawerIsOpen,
    onOpen: exportDrawerOnOpen,
    onClose: exportDrawerOnClose,
  } = useDisclosure();

  useEffect(() => {
    logger.info("Editor loaded");

    let stories: StoryType[] = [];
    Object.keys(localStorage).forEach((key) => {
      if (key?.includes("info")) {
        const value = JSON.parse(localStorage.getItem(key) as string);
        stories.push(value as StoryType);
      }
    });

    stories.sort((a, b) => a.id - b.id);
    logger.success("Get stories from localStorage:", stories);
    setStories(stories);
  }, []);

  return (
    <>
      <CustomHead title="Редактор историй" />
      <Box w="100vw">
        <NavBar>
          <CreateStoryButton />
          <ImportFromFolderButton />
          <ImportFromZipButton />
          <Spacer />
          <ChangeThemeButton rounded={true} />
          <SharedStoriesDrawer />
          <ImportFromServerButton />
          <Button
            fontWeight="normal"
            onClick={() => {
              const requiredStoryKey: string[] = [];
              for (let i = 0; i < localStorage.length; i++) {
                let key = localStorage.key(i);
                if (key?.includes(`story`)) {
                  requiredStoryKey.push(key!);
                }
              }
              requiredStoryKey.forEach((key) => {
                store.remove(key);
              });
              window.location.reload();
            }}
          >
            Удалить всё
          </Button>
        </NavBar>
        <Box
          h="calc(100vh - 57px)"
          overflowY="auto"
          backgroundColor="blackAlpha.50"
        >
          <SimpleGrid columns={5} spacing={2} p={2}>
            {stories.map((story: storyType) => (
              <Card
                key={story?.id}
                border="1px"
                borderColor="gray.200"
                _dark={{
                  borderColor: "gray.600",
                  color: "white",
                }}
                shadow="none"
                display="grid"
                p={2}
              >
                <Link to={"/edit/story/" + story.id}>
                  <Heading _dark={{ color: "white" }} as="h4" size="md">
                    {story.title}
                  </Heading>
                  <Text fontSize="small" color="gray">
                    id: {story.id}
                  </Text>
                  <Box>
                    <Text _dark={{ color: "white" }}>
                      {story.desc.substring(0, 30)}...
                    </Text>
                    <Text _dark={{ color: "white" }}>
                      Уровень доступа: {story.access}
                    </Text>
                  </Box>
                </Link>
                <Box display="flex" gap={1}>
                  <Button
                    fontWeight="normal"
                    w="100%"
                    onClick={() => downloadStoryAsZip(story.id)}
                  >
                    Скачать
                  </Button>
                  <Button
                    onClick={() => {
                      exportDrawerOnOpen();
                      setUploadConfig({
                        id: story.id,
                      });
                    }}
                  >
                    <Icon as={BsCloudUpload} />
                  </Button>
                  <Button
                    onClick={() => {
                      setEditStory(story);
                      editDrawerOnOpen();
                    }}
                  >
                    <Icon as={BiEdit} />
                  </Button>
                </Box>
              </Card>
            ))}
          </SimpleGrid>
        </Box>
      </Box>
      <ExportToServer
        exportDrawerOnClose={exportDrawerOnClose}
        isOpen={exportDrawerIsOpen}
      />
      <EditStoryDrawer isOpen={editDrawerIsOpen} onClose={editDrawerOnClose} />
    </>
  );
};

export default Home;
