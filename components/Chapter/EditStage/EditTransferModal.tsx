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
import { useDispatch, useSelector } from "react-redux";
import { editTransferInStore } from "@/store/reduxStore/stageSlice";

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
  const storeStage = useSelector((state: any) => state.stage.stage);
  const dispatch = useDispatch();

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
          Переход с {storeStage?.id} на {storeStage?.targetTransfer?.stage}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Textarea
            placeholder="Введите текст..."
            defaultValue={storeStage?.targetTransfer?.text}
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
              dispatch(
                editTransferInStore({
                  id: storeStage?.indexTargetTransfer,
                  transfer: {
                    ...storeStage?.targetTransfer,
                    text: event.target.value,
                  },
                })
              );
            }}
          />
          <CreateTransfer transferIndex={storeStage?.indexTargetTransfer} />
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="teal"
            onClick={() => {
              updateStage(storeStage.id);
              setShowModalEditTransfer(false);
            }}
            mr={2}
          >
            Сохранить
          </Button>
          <Button
            colorScheme="teal"
            onClick={() => {
              setShowModalEditTransfer(false);
            }}
          >
            Закрыть
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditTransferModal;
