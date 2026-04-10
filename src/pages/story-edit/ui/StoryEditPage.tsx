import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useUnit } from "effector-react";
import {
  Badge,
  Box,
  Button,
  Grid,
  GridItem,
  Spacer,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import CustomHead from "@/components/Global/CustomHead";
import NavBar from "@/components/UI/NavBar/NavBar";
import ChangeThemeButton from "@/components/UI/NavBar/ChangeThemeButton";
import type { Chapter as chapterType } from "@/entities/chapter";
import { StorySidebarWidget } from "@/widgets/story-sidebar";
import { ChapterGridWidget } from "@/widgets/chapter-grid";
import { ChapterEditorDrawer } from "@/features/chapter-editor-drawer";
import {
  $folders,
  $openChapter,
  $path,
  $selectedFolder,
  chapterCreateRequested,
  chapterDeleted,
  chapterUploaded,
  folderCreated,
  openChapterChanged,
  openChapterPatched,
  openChapterSaved,
  storyPageOpened,
} from "@/pages/story-edit/model";

export function StoryEditPage() {
  const navigate = useNavigate();
  const { storyId } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const path = searchParams.get("path") || "";
  const jsonRef = useRef<HTMLInputElement>(null);

  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();

  const [
    folders,
    selectedFolder,
    position,
    openChapter,
    openStoryPage,
    createFolder,
    createChapterRequest,
    deleteChapter,
    uploadChapter,
    setOpenChapter,
    patchOpenChapter,
    saveOpenChapter,
  ] = useUnit([
    $folders,
    $selectedFolder,
    $path,
    $openChapter,
    storyPageOpened,
    folderCreated,
    chapterCreateRequested,
    chapterDeleted,
    chapterUploaded,
    openChapterChanged,
    openChapterPatched,
    openChapterSaved,
  ]);

  useEffect(() => {
    if (!storyId) return;
    openStoryPage({ storyId, path });
  }, [storyId, path, openStoryPage]);

  const handleCreateChapter = () => {
    createChapterRequest();
  };

  const handleUploadChapter = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!storyId || !e.target.files?.[0]) return;
    const fileBase = new FileReader();
    fileBase.readAsText(e.target.files[0]);
    fileBase.onload = () => {
      const chapter = JSON.parse(fileBase.result as string) as chapterType;
      uploadChapter({ storyId, path: position, chapter });
    };
  };

  const handleUpdateChapter = () => {
    saveOpenChapter();
  };

  return (
    <>
      <CustomHead title="Редактирование карт" />
      <main className="main">
        <NavBar>
          <Button fontWeight="normal" onClick={() => navigate("/")}>
            Назад
          </Button>
          <Button fontWeight="normal" onClick={handleCreateChapter}>
            Создать главу
          </Button>
          <input
            type="file"
            ref={jsonRef}
            accept="application/json"
            hidden
            onChange={handleUploadChapter}
          />
          <Button fontWeight="normal" onClick={() => jsonRef.current?.click()}>
            Загрузить главу из .json
          </Button>
          <Spacer />
          <ChangeThemeButton rounded={true} />
        </NavBar>
        <Grid templateColumns="repeat(6, 1fr)" gap={2} p={2}>
          <GridItem rowSpan={1}>
            <StorySidebarWidget
              createFolder={createFolder}
              folders={folders}
              storyId={storyId || "1"}
            />
          </GridItem>
          <GridItem rowSpan={1} colSpan={5}>
            <Box h="calc(100vh - 73px)" overflowY="auto">
              <Box overflowY="auto">
                <Text my={2}>
                  {`Глава ${storyId}`}
                  {position && " / " + position.split("/").join(" / ")}
                </Text>
                {!selectedFolder.length && (
                  <Badge colorScheme="red">
                    Кажется в этой папке нет глав, какая жалость
                  </Badge>
                )}
                <ChapterGridWidget
                  storyId={storyId || "1"}
                  chapters={selectedFolder}
                  onOpenChapter={setOpenChapter}
                  onOpenSettings={onDrawerOpen}
                />
              </Box>
            </Box>
          </GridItem>
        </Grid>
        {openChapter && (
          <ChapterEditorDrawer
            isOpen={isDrawerOpen}
            onClose={onDrawerClose}
            storyId={+(storyId || 0)}
            chapter={openChapter}
            setChapter={(updater) => {
              const next =
                typeof updater === "function"
                  ? updater(openChapter as chapterType)
                  : updater;
              patchOpenChapter(next);
            }}
            onUpdate={handleUpdateChapter}
            deleteChapter={deleteChapter}
          />
        )}
      </main>
    </>
  );
}
