import React, { useState, useEffect } from "react";
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
  Select,
  SimpleGrid,
  Spacer,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import ChangeThemeButton from "@/components/UI/NavBar/ChangeThemeButton";
import UserButton from "@/components/UI/NavBar/UserButton";
import { BiEdit } from "react-icons/bi";
import { BsCloudUpload } from "react-icons/bs";
import { storyType } from "@/store/types/storyType";
import { chapterType } from "@/store/types/types";
import { mapType } from "@/store/types/mapType";

export default function Home() {
  const [stories, setStories] = useState<any>([]);
  const [editStory, setEditStory] = useState<any>();
  const { isOpen, onOpen, onClose } = useDisclosure();

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
      desc: "Новая история, новая... Да кароче...",
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

  const uploadStory = async (e: any) => {
    const files: any[] = [...e.target.files];

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
    store.set(`story_${editStory?.id}_info`, editStory);
  };

  const uploadStoryToServer = async (storyId: number) => {
    const info = await store.get(`story_${storyId}_info`);

    let chapters: object = {};
    let maps: object = {};
    await store.each(async (key: string, value: chapterType | mapType) => {
      if (key.includes(`story_${storyId}_chapter`)) {
        const arrChapters: any = Object.entries(chapters);
        arrChapters.push([`${value.id}`, value]);
        chapters = Object.fromEntries(arrChapters);
      }
      if (key.includes(`story_${storyId}_map`)) {
        const arrMaps: any = Object.entries(maps);
        arrMaps.push([`${value.id}`, value]);
        maps = Object.fromEntries(arrMaps);
        console.log(maps);
      }
      if (key === "stopLoop") return false;
    });

    const data = {
      ...info,
      chapters,
      maps,
      missions: [],
    };
    const res = await fetch("/pdanetwork/quest/uploadCustom", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const dataRes = await res.json();
    console.log("Отправлено:", data, "\nОтвет:", dataRes);
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
            onChange={(e) => uploadStory(e)}
          />
          <Button fontWeight="10px" onClick={() => createStory()}>
            Создать историю
          </Button>
          <Spacer />
          <ChangeThemeButton rounded={true} />
          <Button
            fontWeight="10px"
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
          >
            Удалить всё
          </Button>
          <UserButton />
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
                  <Button onClick={() => uploadStoryToServer(story.id)}>
                    <Icon as={BsCloudUpload} />
                  </Button>
                  <Button
                    onClick={() => {
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
                  readOnly={true}
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
