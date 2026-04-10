"use client";

import React, { ChangeEvent, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useUnit } from "effector-react";
import store from "@/store/utils/storage";
import { downloadZip } from "client-zip";
import type { Chapter } from "@/entities/chapter";
import type { MapEntity } from "@/entities/map";
import type { Story } from "@/entities/story";
import {
  $editStory,
  $isErrorId,
  $stories,
  $uploadParameters,
  checkUniqueIdRequested,
  createStoryRequested,
  deleteStoryRequested,
  editStoryChanged,
  editStoryStarted,
  homePageStarted,
  saveStoryRequested,
  storiesReloadRequested,
  uploadParametersChanged,
  uploadParametersReset,
  uploadTargetStorySelected,
} from "@/features/home-stories";
import CustomHead from "@/components/Global/CustomHead";
import NavBar from "@/components/UI/NavBar/NavBar";
import {
  Box,
  Button,
  Card,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Icon,
  Input,
  Radio,
  RadioGroup,
  Select,
  SimpleGrid,
  Spacer,
  Stack,
  Switch,
  Text,
  Textarea,
  Tooltip,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import ChangeThemeButton from "@/components/UI/NavBar/ChangeThemeButton";
import { BiEdit } from "react-icons/bi";
import { BsCloudUpload } from "react-icons/bs";
import JSZip from "jszip";
import DownloadFromServerDrawer from "@/components/Story/DownloadFromServerDrawer";
import { FallbackRender } from "@/components/Global/ErrorHandler";
import { ErrorBoundary } from "react-error-boundary";
import { logger } from "@/store/utils/logger";

export function HomePage() {
  const {
    isOpen,
    onOpen,
    onClose,
  } = useDisclosure();
  const {
    isOpen: modalIsOpen,
    onOpen: modalOnOpen,
    onClose: modalOnClose,
  } = useDisclosure();
  const {
    isOpen: downloadModalIsOpen,
    onOpen: downloadModalOnOpen,
    onClose: downloadModalOnClose,
  } = useDisclosure();
  const toast = useToast();

  const [
    stories,
    editStory,
    isErrorId,
    parametersUpload,
    startHomePage,
    requestCreateStory,
    startEditStory,
    changeEditStory,
    requestCheckUniqueId,
    requestSaveStory,
    requestDeleteStory,
    reloadStories,
    changeUploadParameters,
    resetUploadParameters,
    selectUploadTargetStory,
  ] = useUnit([
    $stories,
    $editStory,
    $isErrorId,
    $uploadParameters,
    homePageStarted,
    createStoryRequested,
    editStoryStarted,
    editStoryChanged,
    checkUniqueIdRequested,
    saveStoryRequested,
    deleteStoryRequested,
    storiesReloadRequested,
    uploadParametersChanged,
    uploadParametersReset,
    uploadTargetStorySelected,
  ]);

  useEffect(() => {
    const logo = `
██████╗░██████╗░░█████╗░  ░██████╗░██╗░░░██╗███████╗░██████╗████████╗
██╔══██╗██╔══██╗██╔══██╗  ██╔═══██╗██║░░░██║██╔════╝██╔════╝╚══██╔══╝
██████╔╝██║░░██║███████║  ██║██╗██║██║░░░██║█████╗░░╚█████╗░░░░██║░░░
██╔═══╝░██║░░██║██╔══██║  ╚██████╔╝██║░░░██║██╔══╝░░░╚═══██╗░░░██║░░░
██║░░░░░██████╔╝██║░░██║  ░╚═██╔═╝░╚██████╔╝███████╗██████╔╝░░░██║░░░
╚═╝░░░░░╚═════╝░╚═╝░░╚═╝  ░░░╚═╝░░░░╚═════╝░╚══════╝╚═════╝░░░░╚═╝░░░`;
    logger.info(logo);
    startHomePage();
  }, [startHomePage]);

  async function downloadStory(storyId: number) {
    const info = {
      name: "info.json",
      lastModified: new Date(),
      input: JSON.stringify(store.get(`story_${storyId}_info`), null, 2),
    };

    const arrChapters: Array<{ name: string; lastModified: Date; input: string }> = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = store.get(key);
      if (key?.includes(`story_${storyId}_chapter`)) {
        arrChapters.push({
          name: `chapter_${key?.split("_")[3]}.json`,
          lastModified: new Date(),
          input: JSON.stringify(value, null, 2),
        });
      } else if (key?.includes(`story_${storyId}_map`)) {
        const mapValue = value as MapEntity;
        arrChapters.push({
          name: `maps/${mapValue.id}_${mapValue?.tmx?.split(".")[0] || undefined}.json`,
          lastModified: new Date(),
          input: JSON.stringify(mapValue, null, 2),
        });
      }
    }

    const blob = await downloadZip([info, ...arrChapters]).blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    const dateString = new Date().toLocaleDateString();
    const timeString = `${new Date().getHours()}.${new Date().getMinutes()}.${new Date().getSeconds()}`;
    link.download = `story_${storyId}_${dateString}_${timeString}.zip`;
    link.click();
    link.remove();
  }

  const uploadStoryFromFolder = async (e: ChangeEvent<HTMLInputElement>) => {
    const files: File[] = [...(e.target.files as unknown as File[])];
    let idStory = 0;

    const infoFile = files.find((file) => file.name === "info.json");
    if (!infoFile) {
      return;
    }

    const fileBase = new FileReader();
    fileBase.readAsText(infoFile);
    fileBase.onload = () => {
      idStory = Number(JSON.parse(fileBase.result as string).id);
      store.set(`story_${idStory}_info`, JSON.parse(fileBase.result as string));
      reloadStories();
    };

    files.forEach((file) => {
      const fileReader = new FileReader();
      fileReader.readAsText(file);
      fileReader.onload = () => {
        if (file.name.includes("chapter")) {
          store.set(
            `story_${idStory}_chapter_${JSON.parse(fileReader.result as string).id}`,
            JSON.parse(fileReader.result as string)
          );
        } else if (file.webkitRelativePath.includes("maps")) {
          store.set(
            `story_${idStory}_map_${JSON.parse(fileReader.result as string).id}`,
            JSON.parse(fileReader.result as string)
          );
        }
      };
    });
  };

  const uploadStoryToServer = async (storyId: number) => {
    const info = await store.get<Story>(`story_${storyId}_info`);
    if (!info) return;

    const chapters: Chapter[] = [];
    const maps: MapEntity[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i) as string;
      const value = localStorage.getItem(key);
      if (key?.includes(`story_${storyId}_chapter`) && value) {
        chapters.push(JSON.parse(value) as Chapter);
      }
      if (key?.includes(`story_${storyId}_map`) && value) {
        maps.push(JSON.parse(value) as MapEntity);
      }
    }

    const data = { ...info, needs: [0], chapters, maps };
    let res: Response;
    if (!parametersUpload.toStore) {
      res = await fetch(
        `https://dev.artux.net/pdanetwork/api/v1/admin/quest/set${
          parametersUpload.type === "PUBLIC" ? "/public" : ""
        }?message=${parametersUpload.message}`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
    } else {
      res = await fetch(
        `https://dev.artux.net/pdanetwork/api/v1/admin/quest/storage/upload?message=${parametersUpload.message}&type=${parametersUpload.type}`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
    }

    const dataRes = await res.json();
    if (res.status === 200) {
      toast({
        colorScheme: "green",
        title: "История отправлена успешно",
        description: dataRes.description,
      });
    } else {
      toast({
        colorScheme: "red",
        title: "Произошла ошибка, подробнее в devtools",
        description: dataRes.description,
      });
    }
    resetUploadParameters();
  };

  const uploadStoryFromZip = (e: ChangeEvent<HTMLInputElement>) => {
    const zipFile = e.target.files?.[0];
    if (!zipFile) {
      return;
    }

    const zip = new JSZip();
    let newStoryId = Math.max(...stories.map((story) => story.id)) + 1;
    if (newStoryId === -Infinity) newStoryId = 0;

    zip
      .loadAsync(zipFile)
      .then((archive) => {
        archive.forEach((relativePath, zipEntry) => {
          if (!zipEntry.dir) {
            zipEntry.async("string").then((fileData) => {
              const data = JSON.parse(fileData);
              if (relativePath.includes("info")) {
                const story = { ...data, id: newStoryId };
                store.set(`story_${newStoryId}_info`, story);
                reloadStories();
              } else if (relativePath.includes("chapter")) {
                store.set(`story_${newStoryId}_chapter_${(data as Chapter).id}`, data);
              } else if (relativePath.includes("maps")) {
                store.set(`story_${newStoryId}_maps_${(data as MapEntity).id}`, data);
              }
            });
          }
        });
      })
      .catch((error) => {
        logger.error("Ошибка при распаковке ZIP-файла:", error);
      });
  };

  const folderRef = useRef<HTMLInputElement>(null);
  const zipRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <CustomHead title="Редактор историй" />
      <Box w="100vw">
        <NavBar>
          <Button fontWeight="normal" onClick={requestCreateStory}>
            Создать историю
          </Button>
          <input
            type="file"
            hidden
            ref={folderRef}
            {...{ directory: "", webkitdirectory: "" }}
            onChange={(e) => uploadStoryFromFolder(e)}
          />
          <Button fontWeight="normal" onClick={() => folderRef?.current?.click()}>
            Загрузить из папки
          </Button>
          <input
            type="file"
            id="input"
            accept="application/zip"
            ref={zipRef}
            hidden
            onChange={(e) => uploadStoryFromZip(e)}
          />
          <Button fontWeight="normal" onClick={() => zipRef?.current?.click()}>
            Загрузить из .zip
          </Button>
          <Spacer />
          <ChangeThemeButton rounded />
          <Button fontWeight="normal" onClick={downloadModalOnOpen}>
            Выкачать истории с сервера
          </Button>
          <Button
            fontWeight="normal"
            onClick={() => {
              const requiredStoryKey: string[] = [];
              for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key?.includes("story")) {
                  requiredStoryKey.push(key);
                }
              }
              requiredStoryKey.forEach((key) => {
                store.remove(key);
              });
              reloadStories();
            }}
          >
            Удалить всё
          </Button>
        </NavBar>

        <Box h="calc(100vh - 57px)" overflowY="auto" backgroundColor="blackAlpha.50">
          <SimpleGrid columns={5} spacing={2} p={2}>
            {stories.map((story) => (
              <Card
                key={story.id}
                border="1px"
                borderColor="gray.200"
                _dark={{ borderColor: "gray.600", color: "white" }}
                shadow="none"
                display="grid"
                p={2}
              >
                <ErrorBoundary FallbackComponent={FallbackRender}>
                  <Link to={`/edit/story/${story.id}`}>
                    <Heading _dark={{ color: "white" }} as="h4" size="md">
                      {story.title}
                    </Heading>
                    <Box>
                      <Text _dark={{ color: "white" }}>{story.desc?.substring(0, 30)}...</Text>
                      <Text _dark={{ color: "white" }}>Уровень доступа: {story.access}</Text>
                    </Box>
                  </Link>
                  <Box display="flex" gap={1}>
                    <Button fontWeight="normal" w="100%" onClick={() => downloadStory(story.id)}>
                      Скачать
                    </Button>
                    <Button
                      onClick={() => {
                        modalOnOpen();
                        selectUploadTargetStory(story.id);
                      }}
                    >
                      <Icon as={BsCloudUpload} />
                    </Button>
                    <Button
                      onClick={() => {
                        onOpen();
                        startEditStory(story);
                      }}
                    >
                      <Icon as={BiEdit} />
                    </Button>
                  </Box>
                </ErrorBoundary>
              </Card>
            ))}
          </SimpleGrid>
        </Box>
      </Box>

      <Drawer placement="right" size="md" onClose={modalOnClose} isOpen={modalIsOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Загрузка истории на сервер</DrawerHeader>
          <DrawerBody>
            <VStack gap={2}>
              <FormControl background="gray.100" _dark={{ background: "gray.600" }} borderRadius={10} p={2}>
                <Text>Загрузить как:</Text>
                <RadioGroup
                  value={parametersUpload.type}
                  onChange={(value) =>
                    changeUploadParameters({
                      type: value as "PUBLIC" | "PRIVATE" | "COMMUNITY",
                    })
                  }
                >
                  <Stack direction="row">
                    <Radio value="PUBLIC">Публичную историю</Radio>
                    <Radio value="PRIVATE">Пользовательскую историю</Radio>
                    {parametersUpload.toStore && <Radio value="COMMUNITY">Историю от комьюнити</Radio>}
                  </Stack>
                </RadioGroup>
              </FormControl>
              <FormControl p={2} background="gray.100" _dark={{ background: "gray.600" }} borderRadius={10}>
                <Stack direction="row">
                  <Text>Загрузить в хранилище?</Text>
                  <Switch
                    pt={1}
                    checked={parametersUpload.toStore}
                    onChange={(e) => changeUploadParameters({ toStore: Boolean(e.target.checked) })}
                  />
                </Stack>
              </FormControl>
              <FormControl p={2} background="gray.100" _dark={{ background: "gray.600" }} borderRadius={10}>
                <Tooltip label="Сам честно не понимаю зачем оно" placement="auto-start">
                  <Text>Сообщение:</Text>
                </Tooltip>
                <Input
                  value={parametersUpload.message}
                  background="white"
                  _dark={{ background: "gray.700" }}
                  placeholder="Сообщение..."
                  onChange={(e) => changeUploadParameters({ message: e.target.value })}
                />
              </FormControl>
            </VStack>
          </DrawerBody>
          <DrawerFooter borderTopWidth="1px">
            <Button
              variant="outline"
              mr={3}
              onClick={() => {
                modalOnClose();
                resetUploadParameters();
              }}
            >
              Закрыть
            </Button>
            <Button
              colorScheme="teal"
              onClick={() => {
                modalOnClose();
                uploadStoryToServer(parametersUpload.id);
              }}
            >
              Загрузить
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <ErrorBoundary FallbackComponent={FallbackRender}>
        <DownloadFromServerDrawer
          downloadModalIsOpen={downloadModalIsOpen}
          downloadModalOnClose={downloadModalOnClose}
          stories={stories}
          onStoryDownloaded={reloadStories}
        />
      </ErrorBoundary>

      <Drawer isOpen={isOpen} placement="right" size="md" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Редактирование истории {editStory?.id}</DrawerHeader>
          <DrawerBody>
            <Box display="grid" gap={2}>
              <FormControl isInvalid={isErrorId}>
                <FormLabel>ID</FormLabel>
                <Input
                  value={editStory?.id ?? ""}
                  placeholder="ID истории..."
                  type="number"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const nextId = Number(e.target.value);
                    requestCheckUniqueId(nextId);
                    if (editStory) {
                      changeEditStory({ ...editStory, id: nextId });
                    }
                  }}
                />
                <FormErrorMessage>История с таким ID уже существует</FormErrorMessage>
              </FormControl>
              <Box>
                <FormLabel>Название</FormLabel>
                <Input
                  value={editStory?.title ?? ""}
                  placeholder="Название истории..."
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (editStory) {
                      changeEditStory({ ...editStory, title: e.target.value });
                    }
                  }}
                />
              </Box>
              <Box>
                <FormLabel>Описание</FormLabel>
                <Textarea
                  value={editStory?.desc ?? ""}
                  placeholder="Описание истории..."
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    if (editStory) {
                      changeEditStory({ ...editStory, desc: e.target.value });
                    }
                  }}
                />
              </Box>
              <Box>
                <FormLabel>Иконка</FormLabel>
                <Input
                  placeholder="Иконка истории..."
                  value={editStory?.icon ?? ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (editStory) {
                      changeEditStory({ ...editStory, icon: e.target.value });
                    }
                  }}
                />
              </Box>
              <Box>
                <FormLabel>Уровень доступа</FormLabel>
                <Select
                  value={editStory?.access ?? "USER"}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    if (editStory) {
                      changeEditStory({ ...editStory, access: e.target.value });
                    }
                  }}
                >
                  <option value="USER">USER</option>
                  <option value="TESTER">TESTER</option>
                  <option value="MODERATOR">MODERATOR</option>
                  <option value="ADMIN">ADMIN</option>
                </Select>
              </Box>
            </Box>
          </DrawerBody>
          <DrawerFooter borderTopWidth="1px">
            <Button
              colorScheme="red"
              mr={3}
              onClick={() => {
                onClose();
                if (editStory) {
                  requestDeleteStory(editStory.id);
                }
              }}
            >
              Удалить
            </Button>
            <Button variant="outline" mr={3} onClick={onClose}>
              Закрыть
            </Button>
            <Button
              colorScheme="teal"
              onClick={() => {
                if (!isErrorId) {
                  requestSaveStory();
                  onClose();
                }
              }}
            >
              Сохранить
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
