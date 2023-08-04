import React, { useEffect, useRef, useState } from "react";
import store from "store2";
import { useRouter } from "next/router";
import Link from "next/link";

import CustomHead from "@/components/Global/CustomHead";
import NavBar from "@/components/UI/NavBar/NavBar";
import { newChapter } from "@/store/tools/createTools";
import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Icon,
  SimpleGrid,
  Spacer,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { chapterType } from "@/store/types/types";
import ChangeThemeButton from "@/components/UI/NavBar/ChangeThemeButton";
import { BsThreeDotsVertical } from "react-icons/bs";
import EditChapterDrawer from "@/components/Chapter/EditChapterDrawer";

export default function storyId() {
  const { query, isReady } = useRouter();
  const storyId = query.storyId as string;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [openChapter, setOpenChapter] = useState<chapterType>();
  const [chapters, setChapters] = useState<chapterType[]>([]);

  useEffect(() => {
    store.each((key, value) => {
      key.includes(`story_${storyId}_chapter`) &&
        setChapters((chapters: any) => [...chapters, value]);
      if (key === "stopLoop") return false;
    });
  }, [isReady]);

  const createChapter = () => {
    let newId =
      Math.max(...chapters.map((chapter: chapterType) => +chapter.id)) + 1;

    if (newId === -Infinity) {
      newId = 0;
    }

    store.set(`story_${storyId}_chapter_${newId}`, newChapter(String(newId)));
    setChapters((chapters: any) => [...chapters, newChapter(String(newId))]);
  };

  const deleteChapter = (id: number) => {
    store.remove(`story_${storyId}_chapter_${id}`);
    setChapters(chapters.filter((chapter: chapterType) => id !== chapter.id));
  };

  const uploadChapter = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newId =
      Math.max(...chapters.map((chapter: chapterType) => +chapter.id)) + 1;
    if (newId === -Infinity) {
      newId = 0;
    }
    const fileBase = new FileReader();
    fileBase.readAsText(e.target.files![0]);
    fileBase.onload = () => {
      console.log(fileBase.result);
      const chapter: chapterType = JSON.parse(fileBase.result as string);
      chapter.id = newId;

      setChapters([...chapters, chapter]);
      store.set(`story_${storyId}_chapter_${newId}`, chapter);
    };
  };

  const jsonRef = useRef<HTMLInputElement>(null);

  const onUpdate = () => {
    localStorage.setItem(
      `story_${storyId}_chapter_${openChapter?.id}`,
      JSON.stringify(openChapter)
    );
    window.location.reload();
  };

  return (
    <>
      <CustomHead title="Редактирование карт" />
      <main className="main">
        <NavBar>
          <Button fontWeight="normal" onClick={() => history.go(-1)}>
            Назад
          </Button>
          <Button fontWeight="normal" onClick={() => createChapter()}>
            Создать главу
          </Button>
          <input
            type="file"
            ref={jsonRef}
            accept="application/json"
            hidden
            onChange={(e) => uploadChapter(e)}
          />
          <Button fontWeight="normal" onClick={() => jsonRef?.current?.click()}>
            Загрузить главу из .json
          </Button>
          <Spacer />
          <ChangeThemeButton rounded={true} />
        </NavBar>
        <Box
          h="calc(100vh - 57px)"
          overflowY="auto"
          backgroundColor="blackAlpha.50"
        >
          <SimpleGrid columns={5} spacing={2} p={2}>
            {chapters.map((chapter: chapterType) => (
              <Card
                key={chapter?.id}
                border="1px"
                borderColor="gray.200"
                _dark={{
                  borderColor: "gray.600",
                  color: "white",
                }}
                shadow="none"
                p={2}
              >
                <Flex justifyContent="space-between" alignItems="center">
                  <Link href={"/edit/chapter/" + storyId + "/" + chapter?.id}>
                    {(chapter?.title && (
                      <>
                        <Heading _dark={{ color: "white" }} as="h4" size="md">
                          {chapter?.title}
                        </Heading>
                        <Text color="gray.500">id: {chapter?.id}</Text>
                      </>
                    )) || (
                      <Heading _dark={{ color: "white" }} as="h4" size="md">
                        Глава {chapter?.id}
                      </Heading>
                    )}
                  </Link>
                  <Button
                    onClick={() => {
                      setOpenChapter(chapter);
                      onOpen();
                    }}
                  >
                    <Icon as={BsThreeDotsVertical} mt={1} />
                  </Button>
                </Flex>
                <Text _dark={{ color: "white" }}>
                  Количество стадий: {chapter?.stages?.length}
                </Text>
                {chapter?.points && (
                  <Text _dark={{ color: "white" }}>
                    Количество точек:{" "}
                    {Object.values(chapter?.points!).flat().length}
                  </Text>
                )}
                {chapter?.spawns && (
                  <Text _dark={{ color: "white" }}>
                    Количество спавнов:{" "}
                    {Object.values(chapter?.spawns!).flat().length}
                  </Text>
                )}
              </Card>
            ))}
          </SimpleGrid>
        </Box>
        <EditChapterDrawer
          isOpen={isOpen}
          onClose={onClose}
          storyId={+storyId!}
          chapter={openChapter!}
          setChapter={setOpenChapter as any}
          onUpdate={onUpdate}
          deleteChapter={deleteChapter}
        />
      </main>
    </>
  );
}
