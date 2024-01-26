import { useChapterStore } from "@/entities/chapter";
import { ChapterType } from "@/shared/lib/type/chapter.type";
import { logger } from "@/shared/lib/logger.ts";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  useDisclosure,
} from "@chakra-ui/react";
import { ChangeEvent, useRef, useState } from "react";

const ImportFromJsonButton = () => {
  const { chapters, setChapters, storyId } = useChapterStore();
  const [uploadedChapter, setUploadedChapter] = useState<
    ChapterType | undefined
  >();
  const [minId, setMinId] = useState<number>(0);

  const { onClose, onOpen, isOpen } = useDisclosure();
  const jsonRef = useRef<HTMLInputElement>(null);

  const uploadChapter = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length === 0) return;
    const file = e.target.files![0];

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = JSON.parse(e.target?.result as string) as ChapterType;
      setUploadedChapter(data);
      saveChapter(data);
    };
    reader.readAsText(file);
  };
  const saveChapter = (data?: ChapterType) => {
    if (!data) data = uploadedChapter;
    if (!data) return;
    const id = data.id;

    if (chapters.find((c) => c.id === id)) {
      let newId = Math.max(...chapters.map((c) => c.id)) + 1;
      if (newId === -Infinity) newId = 0;
      setMinId(newId);
      setUploadedChapter((o) => ({ ...(o as ChapterType), id: newId }));

      onOpen();
      return;
    }

    logger.info("Saving chapter:", uploadedChapter);
    setChapters([...chapters, data]);
    localStorage.setItem(
      `story_${storyId}_chapter_${id}`,
      JSON.stringify(uploadedChapter)
    );
  };

  return (
    <>
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

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Переопределение id</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="grid" gap={2}>
            <Alert status="error" rounded="md">
              <AlertIcon />
              <AlertTitle>
                Глава, которую вы хотите загрузить имеет не уникальный id.
              </AlertTitle>
            </Alert>
            <Box>
              <FormLabel>Введите новый id:</FormLabel>
              <NumberInput
                min={minId}
                value={uploadedChapter?.id}
                onChange={(e) =>
                  setUploadedChapter((o) => ({ ...(o as ChapterType), id: +e }))
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Box>
          </ModalBody>
          <ModalFooter display="flex" gap={2}>
            <Button onClick={onClose}>Отменить</Button>
            <Button
              colorScheme="teal"
              onClick={() => {
                saveChapter();
                onClose();
              }}
            >
              Загрузить
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export { ImportFromJsonButton };
