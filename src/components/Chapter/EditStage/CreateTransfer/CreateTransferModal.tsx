import React from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
} from "@chakra-ui/react";
import {
  $connection,
  $stage,
  newTransferInStore,
  setConnection,
} from "@/features/stage-editor";
import { useUnit } from "effector-react";
import { logger } from "@/store/utils/logger";

interface IProps {
  setIsOpenCreateTransfer: (value: boolean) => void;
  updateStage: (stageId: number) => void;
  isOpenCreateTransfer: boolean;
}

const CreateTransferModal = ({
  isOpenCreateTransfer,
  setIsOpenCreateTransfer,
  updateStage,
}: IProps) => {
  const [storeStage, connectionInfo, createTransfer, clearConnection] = useUnit([
    $stage,
    $connection,
    newTransferInStore,
    setConnection,
  ]);

  return (
    <Modal
      onClose={() => {
        setIsOpenCreateTransfer(false);
      }}
      isOpen={isOpenCreateTransfer}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontWeight={1}>
          Создание перехода со стадии {connectionInfo?.source} на{" "}
          {connectionInfo?.target}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Textarea
            placeholder="Введите текст..."
            defaultValue={connectionInfo?.targetTransfer?.text}
            onClick={(event) => {
              (event.target as HTMLTextAreaElement).style.height = "inherit";
              (event.target as HTMLTextAreaElement).style.height = `${
                (event.target as HTMLTextAreaElement).scrollHeight
              }px`;
            }}
            onInput={(event) => {
              (event.target as HTMLTextAreaElement).style.height = "inherit";
              (event.target as HTMLTextAreaElement).style.height = `${
                (event.target as HTMLTextAreaElement).scrollHeight
              }px`;
              createTransfer({
                text: (event.target as HTMLTextAreaElement).value,
                stage: connectionInfo?.target,
                condition: {},
              });
            }}
          />
          Условия можно добавить после сохранения
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="teal"
            onClick={() => {
              logger.info("storeStage, createTransfer", storeStage);
              updateStage(+storeStage.id);
              clearConnection(null);
              setIsOpenCreateTransfer(false);
            }}
            mx={2}
          >
            Сохранить
          </Button>
          <Button
            onClick={() => {
              clearConnection(null);
              setIsOpenCreateTransfer(false);
            }}
          >
            Закрыть
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateTransferModal;
