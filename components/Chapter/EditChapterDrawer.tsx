import React from "react";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { chapterType } from "@/store/types/types";
import store from "store2";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  deleteChapter: (chapterId: number) => void;
  chapter: chapterType;
  setChapter: React.Dispatch<React.SetStateAction<chapterType>>;
  storyId: number;
  onUpdate: () => void;
}

const EditChapterDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  deleteChapter,
  chapter,
  setChapter,
  storyId,
  onUpdate,
}) => {
  const downloadAsFile = (chapterId: number) => {
    const chapter = store.get(`story_${storyId}_chapter_${chapterId}`);
    let a = document.createElement("a");
    let file = new Blob([JSON.stringify(chapter, null, 2)], {
      type: "application/json",
    });
    a.href = URL.createObjectURL(file);
    a.download = `chapter_${chapterId}.json`;
    a.click();
  };

  return (
    <Drawer isOpen={isOpen} placement="right" size="md" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Редактирование главы</DrawerHeader>

        <DrawerBody>
          <VStack mt={1} gap={1}>
            <Input
              value={chapter?.title!}
              placeholder="Название главы..."
              onChange={(e) => {
                setChapter((chapter) => {
                  return {
                    ...chapter,
                    title: e.target.value,
                  };
                });
              }}
            />
            <Textarea
              value={chapter?._comment!}
              placeholder="Комментарий..."
              onChange={(e) => {
                setChapter((chapter) => {
                  return {
                    ...chapter,
                    _comment: e.target.value,
                  };
                });
              }}
            />
          </VStack>
          <VStack mt={2}>
            <Button
              w="100%"
              colorScheme="teal"
              onClick={() => {
                downloadAsFile(chapter.id);
                onClose();
              }}
            >
              Скачать
            </Button>
            <Button
              w="100%"
              colorScheme="red"
              onClick={() => {
                deleteChapter(chapter.id);
                onClose();
              }}
            >
              Удалить
            </Button>
          </VStack>
        </DrawerBody>

        <DrawerFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Закрыть
          </Button>
          <Button
            colorScheme="teal"
            onClick={() => {
              onUpdate();
              onClose();
            }}
          >
            Сохранить
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default EditChapterDrawer;
