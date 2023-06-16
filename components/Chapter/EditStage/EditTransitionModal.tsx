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
} from "@chakra-ui/react";
import { useAppSelector } from "@/store/reduxHooks";

interface Props {
  showModalEditTransition: boolean;
  setShowModalEditTransition: (type: boolean) => void;
}

const EditTransitionModal: React.FC<Props> = ({
  showModalEditTransition,
  setShowModalEditTransition,
}) => {
  const point = useAppSelector((state) => state.stage.transition);
  return (
    <Modal
      onClose={() => {
        setShowModalEditTransition(false);
      }}
      isOpen={showModalEditTransition}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontWeight={1}>
          Переход с карты на {point?.targetStage?.id}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody></ModalBody>
        <ModalFooter>
          <Button
            colorScheme="teal"
            onClick={() => {
              setShowModalEditTransition(false);
            }}
          >
            Закрыть
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditTransitionModal;
