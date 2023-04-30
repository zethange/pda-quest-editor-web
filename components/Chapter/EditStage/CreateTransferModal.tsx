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
import { newTransferToStore, storeStage } from "@/store/store";
import CreateTransfer from "@/components/Chapter/EditStage/CreateTransfer/CreateTransfer";

interface IProps {
  setIsOpenCreateTransfer: (value: boolean) => void;
  setConnectionInfo: (value: any) => void;
  setTransferIndex: (value: string) => void;
  updateStage: (stageId: number) => void;
  connectionInfo: any;
  isOpenCreateTransfer: boolean;
  transferIndex: string;
}

const CreateTransferModal = ({
  isOpenCreateTransfer,
  setIsOpenCreateTransfer,
  setConnectionInfo,
  setTransferIndex,
  connectionInfo,
  updateStage,
  transferIndex,
}: IProps) => {
  return (
    <Modal
      onClose={() => {
        setIsOpenCreateTransfer(false);
        setConnectionInfo(null);
        setTransferIndex("");
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
            onClick={(event: any) => {
              event.target.style.height = "inherit";
              event.target.style.height = `${event.target.scrollHeight}px`;
            }}
            onInput={(event: any) => {
              event.target.style.height = "inherit";
              event.target.style.height = `${event.target.scrollHeight}px`;
              setTransferIndex(
                String(
                  newTransferToStore({
                    text: event.target.value,
                    stage: connectionInfo?.target,
                    condition: {},
                  })
                )
              );
            }}
          />
          {transferIndex ? (
            <CreateTransfer transferIndex={Number(transferIndex)} />
          ) : (
            "Для добавления условий необходимо заполнить текст"
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="teal"
            onClick={() => {
              updateStage(storeStage.id);
              setConnectionInfo(null);
              setTransferIndex("");
              setIsOpenCreateTransfer(false);
            }}
            mx={2}
          >
            Сохранить
          </Button>
          <Button
            onClick={() => {
              setTransferIndex("");
              setConnectionInfo(null);
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
