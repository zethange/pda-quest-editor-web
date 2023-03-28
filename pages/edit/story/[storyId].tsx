import React, { useEffect, useState } from "react";
import store from "store2";
import { useRouter } from "next/router";
import Link from "next/link";

import CustomHead from "@/components/Global/CustomHead";
import NavBar from "@/components/UI/NavBar/NavBar";
import { newChapter } from "@/store/types";
import { MdDelete } from "react-icons/md";
import { Box, Button, Card, Heading, SimpleGrid } from "@chakra-ui/react";

export default function storyId() {
  const { query, isReady } = useRouter();
  const storyId = query.storyId as string;

  const [chapters, setChapters] = useState<any>([]);

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
          <Button fontWeight="10px" onClick={() => history.go(-1)}>
            Назад
          </Button>
          <Button onClick={() => createChapter()}>Создать главу</Button>
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
                shadow="none"
                p={2}
              >
                <Link href={"/edit/chapter/" + storyId + "/" + chapter?.id}>
                  <Heading as="h4" size="md">
                    {`Глава ${chapter?.id}`}
                  </Heading>
                  <div>Количество стадий: {chapter?.stages?.length}</div>
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
