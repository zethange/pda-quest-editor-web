import { useChapterStore } from "@/entities/chapter";
import { ChapterType } from "@/shared/lib/type/chapter.type";
import {
  Button,
  FormControl,
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
import { FC, useEffect, useState } from "react";

export interface EditIdButtonProps {
  chapter: ChapterType;
}

const EditIdButton: FC<EditIdButtonProps> = ({ chapter }) => {
  const [newId, setNewId] = useState<number>(chapter.id);
  const [busyId, setBusyId] = useState<number[]>([]);
  const [error, setError] = useState<string>("");
  const { chapters, storyId } = useChapterStore();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    setBusyId(chapters.map((c) => c.id));
  }, []);

  useEffect(() => {
    if (busyId.includes(newId) && chapter.id !== newId) {
      setError("Данный ID уже используется");
    } else {
      setError("");
    }
  }, [newId]);

  const save = () => {
    localStorage.removeItem(`story_${storyId}_chapter_${chapter.id}`);
    localStorage.setItem(
      `story_${storyId}_chapter_${newId}`,
      JSON.stringify({
        ...chapter,
        id: newId,
      })
    );
    location.reload();
  };

  return (
    <>
      <Button size="sm" onClick={onOpen}>
        Изменить id
      </Button>

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Изменение id у главы</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Новый id главы:</FormLabel>
              <NumberInput value={newId} onChange={(e) => setNewId(+e)}>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {error}
            </FormControl>
          </ModalBody>
          <ModalFooter display="flex" gap={2}>
            <Button onClick={onClose}>Закрыть</Button>
            <Button
              colorScheme="teal"
              onClick={() => {
                if (error) return;
                save();
              }}
            >
              Сохранить
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export { EditIdButton };
