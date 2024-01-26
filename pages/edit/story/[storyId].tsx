import React, { useEffect, useRef, useState } from "react";
import store from "store2";
import { useRouter } from "next/router";

import CustomHead from "@/components/Global/CustomHead";
import NavBar from "@/components/UI/NavBar/NavBar";
import { newChapter } from "@/store/tools/createTools";
import {
  Badge,
  Box,
  Button,
  Grid,
  GridItem,
  SimpleGrid,
  Spacer,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { chapterType } from "@/store/types/story/chapterType";
import ChangeThemeButton from "@/components/UI/NavBar/ChangeThemeButton";
import EditChapterDrawer from "@/components/Chapter/EditChapterDrawer";
import { logger } from "../../../src/shared/lib/logger";
import {
  buildBinaryTree,
  TreeNode,
} from "@/store/utils/storyUtils/buildBinaryTree";
import StorySidebar from "@/components/Story/StorySidebar";
import { createNodeFolder, getNode } from "@/components/Story/node/node";
import ChapterCard from "@/components/Story/ChapterCard/ChapterCard";

export default function StoryId() {
  const { query, isReady, push, asPath } = useRouter();
  const { storyId, path } = query;

  const [chapters, setChapters] = useState<chapterType[]>([]);
  const [folders, setFolders] = useState<TreeNode | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<chapterType[]>([]);
  const [position, setPosition] = useState<string>("");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [openChapter, setOpenChapter] = useState<chapterType>();

  const initialSetup = (storyId: string, path: string) => {
    const chapters: chapterType[] = [];
    store.each((key, value) => {
      key.includes(`story_${storyId}_chapter`) &&
        chapters.push(value as chapterType);
      if (key === "stopLoop") return false;
    });
    chapters.sort((a, b) => a.id - b.id);
    const binary = buildBinaryTree(chapters);
    return { binary, chapters };
  };

  useEffect(() => {
    if (!storyId) return;
    const { binary, chapters } = initialSetup(storyId as string, "");
    logger.success("binary tree:", binary);

    setFolders(binary);

    const nodes = getNode(
      query.path ? (query.path as string) : "",
      binary
    ).chapters;

    setSelectedFolder(nodes);
    setChapters(chapters);
    setPosition(query.path as string);
  }, [isReady, storyId]);

  useEffect(() => {
    const path = query.path as string;
    if (folders) {
      const node = getNode(path, folders);
      setPosition(path);
      setSelectedFolder(node.chapters || []);
    }
  }, [query]);

  const createFolder = (path: string) => {
    const trees = createNodeFolder(path, folders as TreeNode);
    logger.info(
      "create folder, trees:",
      trees,
      "path:",
      path,
      "folders:",
      folders
    );

    setFolders((folders) => trees || folders);
  };

  const createChapter = () => {
    let newId =
      Math.max(...chapters.map((chapter: chapterType) => +chapter.id)) + 1;
    if (newId === -Infinity) newId = 0;

    const chapter = newChapter(String(newId), position);

    store.set(`story_${storyId}_chapter_${newId}`, chapter);
    setChapters((chapters) => [...chapters, chapter]);
  };

  const deleteChapter = (id: number) => {
    store.remove(`story_${storyId}_chapter_${id}`);
    setChapters(chapters.filter((chapter) => id !== chapter.id));
  };

  const uploadChapter = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newId = Math.max(...chapters.map((chapter) => +chapter.id)) + 1;

    if (newId === -Infinity) newId = 0;
    const fileBase = new FileReader();

    fileBase.readAsText(e.target.files![0]);
    fileBase.onload = () => {
      logger.info(fileBase.result);
      const chapter: chapterType = JSON.parse(fileBase.result as string);
      chapter.id = newId;
      chapter.catalog = position;

      setChapters((chapters) => [...chapters, chapter]);
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
          <Button fontWeight="normal" onClick={() => push("/")}>
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
        <Grid templateColumns="repeat(6, 1fr)" gap={2} p={2}>
          <GridItem rowSpan={1}>
            <StorySidebar
              createFolder={createFolder}
              folders={folders!}
              storyId={(storyId as string) || "1"}
            />
          </GridItem>
          <GridItem rowSpan={1} colSpan={5}>
            <Box h="calc(100vh - 73px)" overflowY="auto">
              <Box overflowY="auto">
                <Text my={2}>
                  {`Глава ${storyId}`}
                  {position && " / " + position.split("/").join(" / ")}
                </Text>
                {!selectedFolder?.length && (
                  <Badge colorScheme="red">
                    Кажется в этой папке нет глав, какая жалость
                  </Badge>
                )}
                <SimpleGrid columns={5} spacing={2}>
                  {selectedFolder?.map((chapter: chapterType) => (
                    <ChapterCard
                      storyId={storyId as string}
                      chapter={chapter}
                      setOpenChapter={setOpenChapter}
                      onOpen={onOpen}
                      key={chapter.id}
                    />
                  ))}
                </SimpleGrid>
              </Box>
            </Box>
          </GridItem>
        </Grid>
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
