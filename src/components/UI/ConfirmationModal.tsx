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

interface Props {
  onClose: () => void;
  isOpen: boolean;
  title: string;
  description: React.ReactNode;
  runOnClose: () => void;
}

const ConfirmationModal: React.FC<Props> = ({
  onClose,
  isOpen,
  title,
  description,
  runOnClose,
}) => {
  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{description}</ModalBody>
        <ModalFooter>
          <Button
            onClick={() => {
              onClose();
            }}
            me={2}
          >
            Закрыть
          </Button>
          <Button
            colorScheme="red"
            onClick={() => {
              runOnClose();
              onClose();
            }}
          >
            Удалить
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmationModal;
