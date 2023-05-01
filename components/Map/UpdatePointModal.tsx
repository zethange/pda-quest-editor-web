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
import { pointType } from "@/store/types/mapType";
import { useDispatch, useSelector } from "react-redux";
import { editPoint } from "@/store/reduxStore/mapSlice";

interface IProps {
  showEditPointModal: boolean;
  setShowEditPointModal: (value: boolean) => void;
  updateMap: () => void;
}

const UpdatePointModal = ({
  showEditPointModal,
  setShowEditPointModal,
  updateMap,
}: IProps) => {
  const [updatedPoint, setUpdatedPoint] = useState<pointType | any>({});
  const initialPoint = useSelector((state: any) => state.map.openPoint);
  const dispatch = useDispatch();

  useEffect(() => {
    setUpdatedPoint(initialPoint);
    updateMap();
  }, [showEditPointModal]);

  const updatePoint = () => {
    dispatch(editPoint(updatedPoint));
  };

  return (
    <Modal
      onClose={() => setShowEditPointModal(false)}
      isOpen={showEditPointModal}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Редактирование точки</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box display="grid" gap={2}>
            <FormControl>
              <FormLabel>Тип точки:</FormLabel>
              <Input required value={updatedPoint?.type} readOnly />
            </FormControl>
            <FormControl>
              <FormLabel>Позиция:</FormLabel>
              <Input required value={updatedPoint?.pos} readOnly />
            </FormControl>
            <FormControl>
              <FormLabel>Название точки:</FormLabel>
              <Input
                required
                value={updatedPoint?.name}
                onChange={(e) =>
                  setUpdatedPoint({ ...updatedPoint, name: e.target.value })
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
                  value={updatedPoint?.data?.chapter}
                  type="number"
                  onChange={(e) =>
                    setUpdatedPoint({
                      ...updatedPoint,
                      data: {
                        chapter: e.target.value,
                        stage: updatedPoint?.data?.stage || "",
                      },
                    })
                  }
                />
              </Box>
              <Box>
                <FormLabel>Стадия:</FormLabel>
                <Input
                  required
                  value={updatedPoint?.data?.stage}
                  type="number"
                  onChange={(e) =>
                    setUpdatedPoint({
                      ...updatedPoint,
                      data: {
                        chapter: updatedPoint?.data?.chapter || "",
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
          <Button onClick={() => setShowEditPointModal(false)}>Закрыть</Button>
          <Button
            onClick={() => {
              updatePoint();
              setShowEditPointModal(false);
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

export default UpdatePointModal;
