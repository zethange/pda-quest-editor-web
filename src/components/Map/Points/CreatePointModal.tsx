import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import type { QuestPoint as pointType } from "@/entities/map";
import { useUnit } from "effector-react";
import { logger } from "@/store/utils/logger";
import { $newPoint, pointAdded } from "@/features/map-editor";

interface IProps {
  showCreatePointModal: boolean;
  setShowCreatePointModal: (value: boolean) => void;
  updateMap: () => void;
}

const CreatePointModal = ({
  showCreatePointModal,
  setShowCreatePointModal,
  updateMap,
}: IProps) => {
  const [initialPoint, addPoint] = useUnit([$newPoint, pointAdded]);
  const [newPoint, setNewPoint] = useState<pointType>();

  useEffect(() => {
    setNewPoint(initialPoint);
  }, [showCreatePointModal]);

  const savePoint = () => {
    addPoint(newPoint!);
    logger.info("point:", newPoint);
    updateMap();
  };

  return (
    <Modal
      onClose={() => setShowCreatePointModal(false)}
      isOpen={showCreatePointModal}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Создание точки</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box display="grid" gap={2}>
            <FormControl>
              <FormLabel>Тип точки:</FormLabel>
              <Input required value={newPoint?.type} readOnly />
            </FormControl>
            <FormControl>
              <FormLabel>Позиция:</FormLabel>
              <Input required value={newPoint?.pos} readOnly />
            </FormControl>
            <FormControl>
              <FormLabel>Название точки:</FormLabel>
              <Input
                required
                value={newPoint?.name}
                onChange={(e) =>
                  setNewPoint({ ...newPoint!, name: e.target.value })
                }
              />
            </FormControl>
            <FormControl
              p={2}
              background="gray.50"
              borderRadius="10px"
              display="grid"
              gap={2}
            >
              <Box>
                <FormLabel>Глава:</FormLabel>
                <Input
                  required
                  value={newPoint?.data?.chapter}
                  type="number"
                  onChange={(e) =>
                    setNewPoint({
                      ...newPoint!,
                      data: {
                        chapter: e.target.value,
                        stage: newPoint?.data?.stage || "",
                      },
                    })
                  }
                />
              </Box>
              <Box>
                <FormLabel>Стадия:</FormLabel>
                <Input
                  required
                  value={newPoint?.data?.stage}
                  type="number"
                  onChange={(e) =>
                    setNewPoint({
                      ...newPoint!,
                      data: {
                        chapter: newPoint?.data?.chapter || "",
                        stage: e.target.value,
                      },
                    })
                  }
                />
              </Box>
            </FormControl>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => setShowCreatePointModal(false)}>
            Закрыть
          </Button>
          <Button
            onClick={() => {
              savePoint();
              setShowCreatePointModal(false);
            }}
            colorScheme="teal"
            ml={2}
          >
            Сохранить
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreatePointModal;
