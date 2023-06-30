import React, { useState, useEffect, ChangeEvent } from "react";
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
  FormLabel,
  Heading,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  SimpleGrid,
  Spacer,
  Text,
  Textarea,
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

export default function Home() {
  const [stories, setStories] = useState<storyType[]>([]);
  const [storiesFromServer, setStoriesFromServer] = useState<any>([]);
  const [editStory, setEditStory] = useState<any>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [openStoryId, setOpenStoryId] = useState<number>(0);
  const [openEditStoryId, setOpenEditStoryId] = useState<number>(0);
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
    store.each((key: string, value: string) => {
      if (key.includes("info")) {
        setStories((stories: any) => [...stories, value]);
      }
      if (key === "stopLoop") return false;
    });
  }, []);

  function createStory(): void {
    const infoJSON = {
      id: stories.length,
      title: `Новая история ${stories.length}`,
      desc: "Описание",
      icon: `story/freeplay/screen/${Math.round(Math.random() * 40)}.jpg`,
      access: "USER",
    };

    setStories((stories: any) => [...stories, infoJSON]);
    store.set(`story_${stories.length}_info`, infoJSON);
  }

  async function downloadStory(story_id: number) {
    const info = {
      name: "info.json",
      lastModified: new Date(),
      input: JSON.stringify(store.get(`story_${story_id}_info`), null, 2),
    };

    const arrChapters: any[] = [];
    store.each((key: string, value: any) => {
      if (key.includes(`story_${story_id}_chapter`)) {
        arrChapters.push({
          name: `chapter_${key.split("_")[3]}.json`,
          lastModified: new Date(),
          input: JSON.stringify(value, null, 2),
        });
      } else if (key.includes(`story_${story_id}_map`)) {
        arrChapters.push({
          name: `maps/${value.id}_${
            value?.tmx?.split(".")[0] || undefined
          }.json`,
          lastModified: new Date(),
          input: JSON.stringify(value, null, 2),
        });
      }
      if (key === "stopLoop") return false;
    });

    const blob = await downloadZip([info, ...arrChapters]).blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `story_${story_id}.zip`;
    link.click();
    link.remove();
  }

  const uploadStoryFromFolder = async (e: ChangeEvent<HTMLInputElement>) => {
    const files: any[] = [...(e.target.files as unknown as any[])];

    let idStory: number;

    const infoFile: any = files.filter(
      (file: any) => file.name === "info.json"
    )[0];

    const fileBase = new FileReader();
    fileBase.readAsText(infoFile);
    fileBase.onload = () => {
      idStory = Number(JSON.parse(fileBase.result as string).id);
      setStories((stories: any) => [
        ...stories,
        JSON.parse(fileBase.result as string),
      ]);
      store.set(`story_${idStory}_info`, JSON.parse(fileBase.result as string));
    };

    files.map((file: any) => {
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
    const indexEditedStory = storiesCopy.indexOf(
      storiesCopy.find((story: storyType) => story.id === editStory.id)
    );
    storiesCopy.splice(indexEditedStory, 1, editStory);
    setStories(storiesCopy);
    if (editStory.id !== openEditStoryId) {
      const requriedUpdate: [string, string][] = [];

      store.each((key: string) => {
        console.log("key:", key);
        if (
          key.includes(`story_${openEditStoryId}_chapter`) ||
          key.includes(`story_${openEditStoryId}_map`)
        ) {
          console.log("storyKey:", key);
          const keySplit = key.split("_");
          keySplit[1] = String(editStory.id);
          requriedUpdate.push([key, keySplit.join("_")]);
        }
        if (key === `story_${openEditStoryId}_info`) {
          store.set(`story_${editStory?.id}_info`, editStory);
          store.remove(`story_${openEditStoryId}_info`);
        }
        if (key === "stopLoop") return false;
      });
      console.log(requriedUpdate);
      requriedUpdate.forEach((chapter) => {
        store.set(chapter[1], store.get(chapter[0]));
        store.remove(chapter[0]);
      });
      return;
    }
    store.set(`story_${editStory?.id}_info`, editStory);
  };

  const uploadStoryToServer = async (type: string, storyId: number) => {
    const info = await store.get(`story_${storyId}_info`);

    let chapters: chapterType[] = [];
    let maps: mapType[] = [];
    store.each(async (key: string, value: chapterType | mapType) => {
      if (key.includes(`story_${storyId}_chapter`)) {
        chapters.push(value as chapterType);
      }
      if (key.includes(`story_${storyId}_map`)) {
        maps.push(value as mapType);
      }
      if (key === "stopLoop") return false;
    });

    const data = {
      ...info,
      needs: [0],
      chapters,
      maps,
    };
    console.log(data);
    const res = await fetch(
      `https://dev.artux.net/pdanetwork/api/v1/admin/quest/upload/${type}`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    const dataRes = await res.json();

    if (dataRes.code === 200) {
      toast({
        colorScheme: "green",
        title: "История отправлена успешно, statusCode: 200",
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
  };

  const downloadStoryFromServer = async () => {
    const storiesRes = await fetch(
      `https://dev.artux.net/pdanetwork/api/v1/admin/quest/status`,
      {
        headers: {
          Authorization: `Basic ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );

    const { stories } = await storiesRes.json();
    setStoriesFromServer(stories);
    downloadModalOnOpen();
  };

  const downloadStoryFromServerById = async (id: number) => {
    const res = await fetch(
      `https://dev.artux.net/pdanetwork/api/v1/admin/quest/${id}`,
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

  const deleteStory = (storyId: number) => {
    const storyItems: string[] = [];
    store.each(async (key: string) => {
      if (key.includes(`story_${storyId}`)) {
        storyItems.push(key);
      }
    });

    storyItems.forEach((storyKey) => {
      store.remove(storyKey);
    });
    setStories(stories.filter((story) => story.id !== editStory.id));
  };

  return (
    <>
      <CustomHead title="Редактор историй" />
      <Box w="100vw">
        <NavBar>
          <input
            type="file"
            {...{ directory: "", webkitdirectory: "" }}
            id="input"
            onChange={(e) => uploadStoryFromFolder(e)}
          />
          <Button fontWeight="normal" onClick={() => createStory()}>
            Создать историю
          </Button>
          <Spacer />
          <ChangeThemeButton rounded={true} />
          <Button fontWeight="normal" onClick={() => downloadStoryFromServer()}>
            Выкачать истории с сервера
          </Button>
          <Button
            fontWeight="normal"
            onClick={() => {
              const requiredStoryKey: string[] = [];
              store.each(async (key: string) => {
                if (key.includes(`story`)) {
                  requiredStoryKey.push(key);
                }
              });
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
            {stories.map((story: any) => (
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
                <Link href={"/edit/story/" + story?.id}>
                  <Heading _dark={{ color: "white" }} as="h4" size="md">
                    {story?.title}
                  </Heading>
                  <Box>
                    <Text _dark={{ color: "white" }}>
                      {story?.desc.substring(0, 30)}...
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
                      setOpenStoryId(story.id);
                      //uploadStoryToServer(story.id);
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
              </Card>
            ))}
          </SimpleGrid>
        </Box>
      </Box>
      <Modal onClose={modalOnClose} isOpen={modalIsOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Загрузка истории на сервер</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack>
              <Button
                w="100%"
                onClick={() => {
                  uploadStoryToServer("private", openStoryId);
                  modalOnClose();
                }}
              >
                Загрузить приватно
              </Button>
              <Button
                w="100%"
                onClick={() => {
                  uploadStoryToServer("public", openStoryId);
                  modalOnClose();
                }}
              >
                Загрузить публично
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal
        onClose={downloadModalOnClose}
        isOpen={downloadModalIsOpen}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Загрузка истории с сервера</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack>
              {storiesFromServer.map((story: any) => (
                <Button
                  w="100%"
                  onClick={() => {
                    downloadStoryFromServerById(story.id);
                    downloadModalOnClose();
                  }}
                >
                  {story.title}
                </Button>
              ))}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
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
              <Box>
                <FormLabel>ID</FormLabel>
                <Input
                  defaultValue={editStory?.id}
                  placeholder="ID истории..."
                  type="number"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEditStory((story: storyType) => {
                      return {
                        ...story,
                        id: +e.target.value,
                      };
                    })
                  }
                />
              </Box>

              <Box>
                <FormLabel>Название</FormLabel>
                <Input
                  defaultValue={editStory?.title}
                  placeholder="Название истории..."
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEditStory((story: storyType) => {
                      return {
                        ...story,
                        title: e.target.value,
                      };
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
                    setEditStory((story: storyType) => {
                      return {
                        ...story,
                        desc: e.target.value,
                      };
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
                    setEditStory((story: storyType) => {
                      return {
                        ...story,
                        icon: e.target.value,
                      };
                    })
                  }
                />
              </Box>

              <Box>
                <FormLabel>Уровень доступа</FormLabel>
                <Select
                  defaultValue={editStory?.access}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setEditStory((story: storyType) => {
                      return {
                        ...story,
                        access: e.target.value,
                      };
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
                deleteStory(editStory?.id);
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
                saveUpdatedStory();
                onClose();
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
