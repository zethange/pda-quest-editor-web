import { logger } from "@/store/utils/logger";
import { useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Link } from "react-router-dom";
import store from "store2";

import CustomHead from "@/components/Global/CustomHead";
import { FallbackRender } from "@/components/Global/ErrorHandler";
import DownloadFromServerDrawer from "@/components/Story/DownloadFromServerDrawer";
import ChangeThemeButton from "@/components/UI/NavBar/ChangeThemeButton";
import NavBar from "@/components/UI/NavBar/NavBar";
import { useStoryService, useStoryStore } from "@/entities/story";
import { CreateStoryButton } from "@/features/story/create";
import EditStoryDrawer from "@/features/story/edit/ui/edit-story";
import { ImportFromFolderButton } from "@/features/story/import-from-folder";
import ImportFromZipButton from "@/features/story/import-from-zip/ui/import-from-zip";
import { StoryType } from "@/shared/lib/type/story.type";
import { storyType } from "@/store/types/story/storyType";
import ExportToServerDrawer from "@/widgets/export-to-server-drawer/ui/export-to-server-drawer";
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
  const {
    isOpen: downloadModalIsOpen,
    onOpen: downloadModalOnOpen,
    onClose: downloadModalOnClose,
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
          <Button
            fontWeight="normal"
            onClick={() => {
              downloadModalOnOpen();
            }}
          >
            Выкачать истории с сервера
          </Button>
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
      <ExportToServerDrawer
        exportDrawerOnClose={exportDrawerOnClose}
        isOpen={exportDrawerIsOpen}
      />
      <EditStoryDrawer isOpen={editDrawerIsOpen} onClose={editDrawerOnClose} />
      <ErrorBoundary FallbackComponent={FallbackRender}>
        <DownloadFromServerDrawer
          downloadModalIsOpen={downloadModalIsOpen}
          downloadModalOnClose={downloadModalOnClose}
          setStories={setStories}
          stories={stories}
        />
      </ErrorBoundary>
    </>
  );
};

export default Home;
