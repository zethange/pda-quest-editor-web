import { useChapterStore } from "@/entities/chapter";
import { ChapterType } from "@/shared/lib/type/chapter.type";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
} from "@chakra-ui/react";
import { FC } from "react";

export interface ChapterEditDrawerProps {
  chapter: ChapterType;
}

const ChapterEditDrawer: FC<ChapterEditDrawerProps> = ({ chapter }) => {
  const { editChapter, setEditChapter, storyId } = useChapterStore();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const save = () => {
    localStorage.setItem(
      `story_${storyId}_chapter_${editChapter?.id}`,
      JSON.stringify(editChapter)
    );
    location.reload();
  };

  return (
    <>
      <Button
        size="sm"
        onClick={() => {
          setEditChapter(undefined);
          setEditChapter(chapter);
          onOpen();
        }}
      >
        Редактировать
      </Button>

      <Drawer onClose={onClose} isOpen={isOpen} size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Редактирование главы {editChapter?.id}</DrawerHeader>
          <DrawerBody>
            <Box display="grid" alignItems="start" gap={2}>
              <FormControl>
                <FormLabel>ID главы:</FormLabel>
                <Input readOnly value={editChapter?.id} />
              </FormControl>
              <FormControl>
                <FormLabel>Название главы:</FormLabel>
                <Input
                  value={editChapter?.title}
                  onChange={(e) => {
                    setEditChapter({ title: e.target.value as string });
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Комментарий:</FormLabel>
                <Input
                  value={editChapter?._comment}
                  onChange={(e) => {
                    setEditChapter({ _comment: e.target.value as string });
                  }}
                />
              </FormControl>
            </Box>
          </DrawerBody>
          <DrawerFooter display="flex" gap={2}>
            <Button onClick={onClose}>Закрыть</Button>
            <Button
              colorScheme="teal"
              onClick={() => {
                save();
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
};

export { ChapterEditDrawer };
