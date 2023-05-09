import React, { useEffect, useState } from "react";
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
  Heading,
  SimpleGrid,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { chapterType } from "@/store/types/types";
import ChangeThemeButton from "@/components/UI/NavBar/ChangeThemeButton";
import UserButton from "@/components/UI/NavBar/UserButton";

export default function storyId() {
  const { query, isReady } = useRouter();
  const storyId = query.storyId as string;

  const [chapters, setChapters] = useState<chapterType[] | any>([]);

  useEffect(() => {
    store.each((key, value) => {
      key.includes(`story_${storyId}_chapter`) &&
        setChapters((chapters: any) => [...chapters, value]);
      if (key === "stopLoop") return false;
    });
  }, [isReady]);

  const createChapter = () => {
    store.set(
      `story_${storyId}_chapter_${chapters.length}`,
      newChapter(chapters.length)
    );
    setChapters((chapters: any) => [...chapters, newChapter(chapters.length)]);

    console.log(`Создание главы в истории ${storyId}`, [
      ...chapters,
      newChapter(chapters.length),
    ]);
  };

  const deleteChapter = (id: number) => {
    store.remove(`story_${storyId}_chapter_${id}`);
    setChapters(chapters.filter((chapter: any) => id !== chapter.id));
    console.log("Удаление главы", `story_${storyId}_chapter_${id}`);
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
          <Spacer />
          <ChangeThemeButton rounded={true} />
          <UserButton />
        </NavBar>
        <Box
          h="calc(100vh - 57px)"
          overflowY="auto"
          backgroundColor="blackAlpha.50"
        >
          <SimpleGrid columns={5} spacing={2} p={2}>
            {chapters.map((chapter: any) => (
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
                <Link href={"/edit/chapter/" + storyId + "/" + chapter?.id}>
                  <Heading _dark={{ color: "white" }} as="h4" size="md">
                    {`Глава ${chapter?.id}`}
                  </Heading>
                  <Text _dark={{ color: "white" }}>
                    Количество стадий: {chapter?.stages?.length}
                  </Text>
                </Link>
                <Button onClick={() => deleteChapter(chapter?.id)}>
                  Удалить
                </Button>
              </Card>
            ))}
          </SimpleGrid>
        </Box>
      </main>
    </>
  );
}
