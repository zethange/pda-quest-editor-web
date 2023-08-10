"use client";

import React, { useState, useEffect, ChangeEvent, useRef } from "react";
import Link from "next/link";
import store from "store2";
import { downloadZip } from "client-zip";

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
import { storyType } from "@/store/types/storyType";
import { chapterType } from "@/store/types/types";
import { mapType } from "@/store/types/mapType";
import JSZip from "jszip";
import DownloadFromServerDrawer from "@/components/Story/DownloadFromServerDrawer";
import { FallbackRender } from "@/components/Global/ErrorHandler";
import { ErrorBoundary } from "react-error-boundary";

interface Author {
  id: string;
  login: string;
  name: string;
  nickname: string;
  avatar: string;
  pdaId: number;
  xp: number;
  achievements: number;
  gang: string; // Замените "OTHER_GANG" на реальное имя другой банды, если таковая имеется.
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

interface IParametersUpload {
  id: number;
  type: "PUBLIC" | "PRIVATE" | "COMMUNITY";
  toStore: boolean;
  message: string;
}

export default function Home() {
  const [stories, setStories] = useState<storyType[]>([]);
  const [editStory, setEditStory] = useState<storyType>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [openEditStoryId, setOpenEditStoryId] = useState<number>(0);
  const [parametersUpload, setParametersUpload] = useState<IParametersUpload>({
    id: 0,
    type: "PUBLIC",
    toStore: false,
    message: "",
  });

  const resetParametersUpload = () => {
    setParametersUpload({
      id: 0,
      type: "PUBLIC",
      toStore: false,
      message: "",
    });
  };

  const [isErrorId, setIsErrorId] = useState(false);
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

  useEffect(() => {
    let neededStories: storyType[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      const value = store.get(key);
      if (key?.includes("info")) {
        console.log(key, value);
        neededStories.push(value as storyType);
      }
    }
    setStories(neededStories);
  }, []);

  function createStory(): void {
    let newStoryId = Math.max(...stories.map((story) => story.id)) + 1;
    if (newStoryId === -Infinity) {
      newStoryId = 0;
    }
    console.log(newStoryId);
    const infoJSON = {
      id: newStoryId,
      title: `Новая история ${stories.length}`,
      desc: "Описание",
      icon: `story/freeplay/screen/${Math.round(Math.random() * 40)}.jpg`,
      access: "USER",
    };

    setStories([...stories, infoJSON]);
    store.set(`story_${newStoryId}_info`, infoJSON);
  }

  async function downloadStory(story_id: number) {
    const info = {
      name: "info.json",
      lastModified: new Date(),
      input: JSON.stringify(store.get(`story_${story_id}_info`), null, 2),
    };

    const arrChapters: any[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      const value = store.get(key);
      if (key?.includes(`story_${story_id}_chapter`)) {
        arrChapters.push({
          name: `chapter_${key?.split("_")[3]}.json`,
          lastModified: new Date(),
          input: JSON.stringify(value, null, 2),
        });
      } else if (key?.includes(`story_${story_id}_map`)) {
        arrChapters.push({
          name: `maps/${value.id}_${
            value?.tmx?.split(".")[0] || undefined
          }.json`,
          lastModified: new Date(),
          input: JSON.stringify(value, null, 2),
        });
      }
    }

    const blob = await downloadZip([info, ...arrChapters]).blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);

    const dateString = new Date().toLocaleDateString();
    const timeString =
      new Date().getHours() +
      "." +
      new Date().getMinutes() +
      "." +
      new Date().getSeconds();
    link.download = `story_${story_id}_${dateString}_${timeString}.zip`;
    link.click();
    link.remove();
  }

  const uploadStoryFromFolder = async (e: ChangeEvent<HTMLInputElement>) => {
    const files: File[] = [...(e.target.files as unknown as File[])];

    console.log(files);
    let idStory: number;

    const infoFile: File = files.find(
      (file: File) => file.name === "info.json"
    )!;

    const fileBase = new FileReader();
    fileBase.readAsText(infoFile);
    fileBase.onload = () => {
      idStory = Number(JSON.parse(fileBase.result as string).id);
      setStories([...stories, JSON.parse(fileBase.result as string)]);
      store.set(`story_${idStory}_info`, JSON.parse(fileBase.result as string));
    };

    files.map((file: File) => {
      const fileReader = new FileReader();
      fileReader.readAsText(file);
      fileReader.onload = () => {
        if (file.name.includes("chapter")) {
          store.set(
            `story_${idStory}_chapter_${
              JSON.parse(fileReader.result as string).id
            }`,
            JSON.parse(fileReader.result as string)
          );
        } else if (file.webkitRelativePath.includes("maps")) {
          store.set(
            `story_${idStory}_map_${
              JSON.parse(fileReader.result as string).id
            }`,
            JSON.parse(fileReader.result as string)
          );
        }
      };
    });
  };

  const saveUpdatedStory = () => {
    const storiesCopy = JSON.parse(JSON.stringify(stories));
    const indexEditedStory = storiesCopy.findIndex(
      (story: storyType) => story.id === editStory?.id
    );

    storiesCopy.splice(indexEditedStory, 1, editStory);
    setStories(storiesCopy);
    if (editStory?.id !== openEditStoryId) {
      const requriedUpdate: [string, string][] = [];

      for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        if (
          key?.includes(`story_${openEditStoryId}_chapter`) ||
          key?.includes(`story_${openEditStoryId}_map`)
        ) {
          console.log("storyKey:", key);
          const keySplit = key?.split("_");
          keySplit[1] = String(editStory?.id);
          requriedUpdate.push([key!, keySplit.join("_")]);
        }
        if (key === `story_${openEditStoryId}_info`) {
          store.set(`story_${editStory?.id}_info`, editStory);
          store.remove(`story_${openEditStoryId}_info`);
        }
      }
      requriedUpdate.forEach((chapter) => {
        store.set(chapter[1], store.get(chapter[0]));
        store.remove(chapter[0]);
      });
      return;
    }
    store.set(`story_${editStory?.id}_info`, editStory);
  };

  const uploadStoryToServer = async (storyId: number) => {
    const info = await store.get(`story_${storyId}_info`);

    let chapters: chapterType[] = [];
    let maps: mapType[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i) as string;
      const value = localStorage.getItem(key!);
      if (key?.includes(`story_${storyId}_chapter`)) {
        chapters.push(JSON.parse(value as string) as unknown as chapterType);
      }
      if (key?.includes(`story_${storyId}_map`)) {
        maps.push(JSON.parse(value as string) as unknown as mapType);
      }
    }

    const data = {
      ...info,
      needs: [0],
      chapters,
      maps,
    };
    console.log("data:", data, info);
    if (!parametersUpload.toStore) {
      var res = await fetch(
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
      // грузим в хранилище
      var res = await fetch(
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
    console.log("Отправлено:", data, "\nОтвет:", dataRes);
    resetParametersUpload();
  };

  const deleteStory = (storyId: number) => {
    const storyItems: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      if (key?.includes(`story_${storyId}`)) {
        storyItems.push(key!);
      }
    }

    storyItems.forEach((storyKey) => {
      store.remove(storyKey);
    });
    location.reload();
  };

  const uploadStoryFromZip = (e: ChangeEvent<HTMLInputElement>) => {
    const zipFile = e.target.files![0];
    console.log(zipFile);
    const zip = new JSZip();
    let newStoryId = Math.max(...stories.map((story) => story.id)) + 1;
    if (newStoryId === -Infinity) newStoryId = 0;

    console.log(newStoryId);
    zip
      .loadAsync(zipFile)
      .then(function (zip) {
        zip.forEach(function (relativePath, zipEntry) {
          if (!zipEntry.dir) {
            zipEntry.async("string").then(function (fileData) {
              const data = JSON.parse(fileData);
              if (relativePath.includes("info")) {
                const story = {
                  ...data,
                  id: newStoryId,
                };
                setStories([...stories, story]);
                store.set(`story_${newStoryId}_info`, story);
              } else if (relativePath.includes("chapter")) {
                store.set(
                  `story_${newStoryId}_chapter_${(data as chapterType).id}`,
                  data
                );
              } else if (relativePath.includes("maps")) {
                store.set(
                  `story_${newStoryId}_maps_${(data as mapType).id}`,
                  data
                );
              }
            });
          }
        });
      })
      .catch(function (error) {
        console.error("Ошибка при распаковке ZIP-файла:", error);
      });
  };

  const checkUniqueId = (storyId: number, openEditStoryId: number) => {
    const allIds = stories.map((story) => story.id);
    const exists = allIds.indexOf(storyId) !== -1;

    if (exists && storyId === openEditStoryId) {
      setIsErrorId(false);
    } else {
      setIsErrorId(exists);
    }
  };
  const folderRef = useRef<HTMLInputElement>(null);
  const zipRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <CustomHead title="Редактор историй" />
      <Box w="100vw">
        <NavBar>
          <Button fontWeight="normal" onClick={() => createStory()}>
            Создать историю
          </Button>
          <input
            type="file"
            hidden
            ref={folderRef}
            {...{ directory: "", webkitdirectory: "" }}
            onChange={(e) => uploadStoryFromFolder(e)}
          />
          <Button
            fontWeight="normal"
            onClick={() => folderRef?.current?.click()}
          >
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
                <ErrorBoundary FallbackComponent={FallbackRender}>
                  <Link href={"/edit/story/" + story?.id}>
                    <Heading _dark={{ color: "white" }} as="h4" size="md">
                      {story?.title}
                    </Heading>
                    <Box>
                      <Text _dark={{ color: "white" }}>
                        {story?.desc?.substring(0, 30)}...
                      </Text>
                      <Text _dark={{ color: "white" }}>
                        Уровень доступа: {story?.access}
                      </Text>
                    </Box>
                  </Link>
                  <Box display="flex" gap={1}>
                    <Button
                      fontWeight="normal"
                      w="100%"
                      onClick={() => downloadStory(story?.id)}
                    >
                      Скачать
                    </Button>
                    <Button
                      onClick={() => {
                        modalOnOpen();
                        setParametersUpload({
                          ...parametersUpload,
                          id: story?.id,
                        });
                      }}
                    >
                      <Icon as={BsCloudUpload} />
                    </Button>
                    <Button
                      onClick={() => {
                        setOpenEditStoryId(story.id);
                        onOpen();
                        setEditStory(story);
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
      <Drawer
        placement="right"
        size="md"
        onClose={modalOnClose}
        isOpen={modalIsOpen}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">
            Загрузка истории на сервер
          </DrawerHeader>
          <DrawerBody>
            <VStack gap={2}>
              <FormControl
                background="gray.100"
                _dark={{ background: "gray.600" }}
                borderRadius={10}
                p={2}
              >
                <Text>Загрузить как:</Text>
                <RadioGroup
                  value={parametersUpload.type}
                  onChange={(value) => {
                    setParametersUpload({
                      ...parametersUpload,
                      type: value as "PUBLIC" | "PRIVATE" | "COMMUNITY",
                    });
                  }}
                >
                  <Stack direction="row">
                    <Radio value="PUBLIC">Публичную историю</Radio>
                    <Radio value="PRIVATE">Пользовательскую историю</Radio>
                    {parametersUpload.toStore && (
                      <Radio value="COMMUNITY">Историю от коммьюнити</Radio>
                    )}
                  </Stack>
                </RadioGroup>
              </FormControl>
              <FormControl
                p={2}
                background="gray.100"
                _dark={{ background: "gray.600" }}
                borderRadius={10}
              >
                <Stack direction="row">
                  <Text>Загрузить в хранилище?</Text>
                  <Switch
                    pt={1}
                    checked={parametersUpload.toStore}
                    onChange={(e) => {
                      setParametersUpload({
                        ...parametersUpload,
                        toStore: Boolean(e.target.checked),
                      });
                    }}
                  />
                </Stack>
              </FormControl>
              <FormControl
                p={2}
                background="gray.100"
                _dark={{ background: "gray.600" }}
                borderRadius={10}
              >
                <Tooltip
                  label="Сам честно не понимаю зачем оно"
                  placement="auto-start"
                >
                  <Text>Сообщение:</Text>
                </Tooltip>
                <Input
                  value={parametersUpload.message}
                  background="white"
                  _dark={{
                    background: "gray.700",
                  }}
                  placeholder="Сообщение..."
                  onChange={(e) => {
                    setParametersUpload({
                      ...parametersUpload,
                      message: e.target.value,
                    });
                  }}
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
                resetParametersUpload();
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
          setStories={setStories}
          stories={stories}
        />
      </ErrorBoundary>
      {/* drawer */}
      <Drawer isOpen={isOpen} placement="right" size="md" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            Редактирование истории {editStory?.id}
          </DrawerHeader>
          <DrawerBody>
            <Box display="grid" gap={2}>
              <FormControl isInvalid={isErrorId}>
                <FormLabel>ID</FormLabel>
                <Input
                  defaultValue={editStory?.id}
                  placeholder="ID истории..."
                  type="number"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    checkUniqueId(+e.target.value, openEditStoryId);
                    setEditStory({
                      ...editStory!,
                      id: +e.target.value,
                    });
                  }}
                />
                <FormErrorMessage>
                  История с таким ID уже существует
                </FormErrorMessage>
              </FormControl>
              <Box>
                <FormLabel>Название</FormLabel>
                <Input
                  defaultValue={editStory?.title}
                  placeholder="Название истории..."
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEditStory({
                      ...editStory!,
                      title: e.target.value,
                    })
                  }
                />
              </Box>
              <Box>
                <FormLabel>Описание</FormLabel>
                <Textarea
                  defaultValue={editStory?.desc}
                  placeholder="Описание истории..."
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setEditStory({
                      ...editStory!,
                      desc: e.target.value,
                    })
                  }
                />
              </Box>
              <Box>
                <FormLabel>Иконка</FormLabel>
                <Input
                  placeholder="Иконка истории..."
                  defaultValue={editStory?.icon}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEditStory({
                      ...editStory!,
                      icon: e.target.value,
                    })
                  }
                />
              </Box>
              <Box>
                <FormLabel>Уровень доступа</FormLabel>
                <Select
                  defaultValue={editStory?.access}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setEditStory({
                      ...editStory!,
                      access: e.target.value,
                    })
                  }
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
                deleteStory(openEditStoryId as number);
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
                  saveUpdatedStory();
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
