import { useState, useEffect } from "react";
import Link from "next/link";
import store from "store2";
import { downloadZip } from "client-zip";

import CustomHead from "@/components/Global/CustomHead";
import NavBar from "@/components/UI/NavBar/NavBar";
import {
  Box,
  Button,
  Card,
  Heading,
  SimpleGrid,
  Spacer,
  Text,
} from "@chakra-ui/react";
import ChangeThemeButton from "@/components/UI/NavBar/ChangeThemeButton";

export default function Home() {
  const [stories, setStories] = useState<any>([]);

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
    store.each((key: string, value: string) => {
      if (key.includes(`story_${story_id}_chapter`)) {
        arrChapters.push({
          name: `chapter_${key.split("_")[3]}.json`,
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

    console.log(e.target.files);
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
        }
      };
    });
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
                p={2}
              >
                <Link href={"/edit/story/" + story?.id}>
                  <Heading _dark={{ color: "white" }} as="h4" size="md">
                    {story?.title}
                  </Heading>
                  <Box>
                    <Text _dark={{ color: "white" }}>{story?.desc}</Text>
                    <Text _dark={{ color: "white" }}>
                      Уровень доступа: {story?.access}
                    </Text>
                  </Box>
                </Link>
                <Button
                  fontWeight="10px"
                  onClick={() => downloadStory(story?.id)}
                >
                  Скачать
                </Button>
              </Card>
            ))}
          </SimpleGrid>
        </Box>
      </Box>
    </>
  );
}
