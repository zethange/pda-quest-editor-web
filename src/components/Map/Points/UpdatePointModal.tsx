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
import { pointType } from "@/store/types/story/mapType";
import { deletePoint, editPoint } from "@/store/reduxStore/slices/mapSlice";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/reduxStore/reduxHooks";
import EditActionsRefactor from "@/components/Chapter/EditStage/EditActions/EditActionsRefactor";

interface IProps {
  showEditPointModal: boolean;
  storyId: string;
  setShowEditPointModal: (value: boolean) => void;
  updateMap: () => void;
}

const UpdatePointModal = ({
  storyId,
  showEditPointModal,
  setShowEditPointModal,
  updateMap,
}: IProps) => {
  const [updatedPoint, setUpdatedPoint] = useState<pointType | any>({});
  const initialPoint = useAppSelector((state) => state.map.openPoint);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setUpdatedPoint(initialPoint);
  }, [showEditPointModal]);

  const updatePoint = () => {
    dispatch(editPoint(updatedPoint));
    updateMap();
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
                <FormLabel>
                  Стадия:{" "}
                  <Link
                    href={{
                      pathname: `/edit/chapter/${storyId}/${updatedPoint?.data?.chapter}`,
                      query: { stage: updatedPoint?.data?.stage },
                    }}
                  >
                    <Button size="xs">Перейти</Button>
                  </Link>
                </FormLabel>
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
            <FormControl>
              <EditActionsRefactor
                actions={updatedPoint?.actions!}
                noDispatch
                onChangeActions={(e: any) => {
                  const copyPoint = JSON.parse(JSON.stringify(updatedPoint));
                  copyPoint.actions = e;
                  setUpdatedPoint(copyPoint);
                }}
              />
            </FormControl>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={() => {
              dispatch(deletePoint());
              setShowEditPointModal(false);
              updateMap();
            }}
            mr={2}
            colorScheme="red"
          >
            Удалить
          </Button>
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
