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
import CreateTransfer from "@/components/Chapter/EditStage/CreateTransfer/CreateTransfer";
import {
  $stage,
  $targetTransfer,
  deleteTransferInStore,
  editTransferInStore,
} from "@/features/stage-editor";
import { useUnit } from "effector-react";

interface IProps {
  setShowModalEditTransfer: (value: boolean) => void;
  showModalEditTransfer: boolean;
  updateStage: (stageId: number) => void;
}

const EditTransferModal = ({
  setShowModalEditTransfer,
  showModalEditTransfer,
  updateStage,
}: IProps) => {
  const [storeStage, targetTransfer, editTransfer, deleteTransfer] = useUnit([
    $stage,
    $targetTransfer,
    editTransferInStore,
    deleteTransferInStore,
  ]);

  return (
    <Modal
      onClose={() => {
        setShowModalEditTransfer(false);
      }}
      isOpen={showModalEditTransfer}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontWeight={1}>
          Переход с {storeStage?.id} на {targetTransfer?.targetTransfer?.stage}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Textarea
            placeholder="Введите текст..."
            defaultValue={targetTransfer?.targetTransfer?.text}
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
              editTransfer({
                id: targetTransfer?.indexTargetTransfer,
                transfer: {
                  ...targetTransfer?.targetTransfer,
                  text: event.target.value,
                },
              });
            }}
          />
          <CreateTransfer transferIndex={targetTransfer?.indexTargetTransfer} />
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="red"
            onClick={() => {
              deleteTransfer(targetTransfer.indexTargetTransfer);
              updateStage(storeStage.id);
              setShowModalEditTransfer(false);
            }}
            me={2}
          >
            Удалить
          </Button>
          <Button
            colorScheme="teal"
            onClick={() => {
              setShowModalEditTransfer(false);
            }}
            me={2}
          >
            Закрыть
          </Button>
          <Button
            colorScheme="teal"
            onClick={() => {
              updateStage(storeStage.id);
              setShowModalEditTransfer(false);
            }}
          >
            Сохранить
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditTransferModal;
