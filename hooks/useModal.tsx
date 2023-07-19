"use client";

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
  useDisclosure,
} from "@chakra-ui/react";
import { createPortal } from "react-dom";

interface Props {
  title: string;
  description: React.ReactNode;
  runOnClose: () => void;
}

const useModal = ({ title, description, runOnClose }: Props) => {
  const { onClose, isOpen } = useDisclosure({ defaultIsOpen: true });

  const modal = (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{description}</ModalBody>
        <ModalFooter>
          <Button
            me={1}
            onClick={() => {
              onClose();
            }}
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

  return createPortal(modal, document.querySelector("#__next")!);
};

export default useModal;
