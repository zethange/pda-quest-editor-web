import React from "react";

import { Box, Button, Flex, Text, useDisclosure } from "@chakra-ui/react";
import { stageTypes } from "@/store/utils/stageName";
import MapStage from "@/components/Chapter/EditStage/MapStage";
import EditStage from "@/components/Chapter/EditStage/EditStage";
import EditActionsRefactor from "@/components/Chapter/EditStage/EditActions/EditActionsRefactor";
import { stageType } from "@/store/types/story/chapterType";
import { editActions } from "@/store/reduxStore/slices/stageSlice";
import FromMapStage from "@/components/Chapter/EditStage/FromMapStage";
import { useAppSelector } from "@/store/reduxStore/reduxHooks";
import { useRouter } from "next/router";
import ConfirmationModal from "@/components/UI/ConfirmationModal";
import { logger } from "@/store/utils/logger";

interface IProps {
  updateStage: (stageId: number) => void;
  deleteStage: (stageId: number) => void;
  deletePoint: () => void;
  setEditableStage: (stage: stageType | undefined) => void;
  updateTransitionFromMap: () => void;
}

const EditStagePopover = ({
  updateStage,
  deleteStage,
  deletePoint,
  setEditableStage,
  updateTransitionFromMap,
}: IProps) => {
  const storeStage = useAppSelector((state) => state.stage.stage);
  const transitionFromMap = useAppSelector(
    (state) => state.stage.transitionFromMap
  );
  const settings = useAppSelector((state) => state.user.settings);
  const { query } = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  logger.info("stage:", storeStage);
  logger.info("transitionFromMap:", transitionFromMap);

  return (
    <>
      <Box
        zIndex="1"
        p={2}
        w={settings.drawerEditStageWidth + "px" || "450px"}
        borderLeft="1px"
        borderColor="gray.200"
        backgroundColor="white"
        _dark={{
          backgroundColor: "gray.900",
          color: "white",
          borderColor: "gray.900",
        }}
        position="absolute"
        right="0"
        bottom="0"
      >
        <Box h="calc(100vh - 147px)" overflowY="scroll">
          {stageTypes(storeStage?.type_stage) === "default" && (
            <Text color="gray.500">
              id: {storeStage.id}, {query.chapter![0]}:{query.chapter![1]}:
              {storeStage.id}
            </Text>
          )}
          {transitionFromMap && <FromMapStage />}
          {stageTypes(storeStage?.type_stage) === "map" && (
            <MapStage data={storeStage?.data} />
          )}
          {stageTypes(storeStage?.type_stage) === "default" &&
            storeStage?.texts?.length && <EditStage />}
          {stageTypes(storeStage?.type_stage) === "default" && (
            <EditActionsRefactor
              actions={storeStage?.actions}
              onChangeActions={editActions}
            />
          )}
        </Box>
        <Flex>
          <Button
            colorScheme="teal"
            size="md"
            mt={2}
            me={2}
            onClick={() => {
              if (!transitionFromMap) {
                updateStage(storeStage?.id);
              } else {
                updateTransitionFromMap();
              }
              setEditableStage(undefined);
            }}
          >
            Сохранить
          </Button>
          <Button
            size="md"
            mt={2}
            colorScheme="teal"
            onClick={() => {
              setEditableStage(undefined);
            }}
          >
            Закрыть
          </Button>
          <Box m="auto" />
          <Button
            colorScheme="red"
            size="md"
            mt={2}
            onClick={() => {
              onOpen();
            }}
          >
            Удалить
          </Button>
        </Flex>
        <ConfirmationModal
          isOpen={isOpen}
          onClose={onClose}
          title={transitionFromMap ? "Удаление перехода" : "Удаление стадии"}
          description={
            <Box>
              А вы точно уверены?
              <br />
              <a
                style={{ color: "red" }}
                href="https://www.change.org/p/%D0%B4%D0%BE%D0%BB%D0%BE%D0%B9-%D0%BC%D0%BE%D0%B4%D0%B0%D0%BB%D0%BA%D0%B8-%D0%BF%D0%BE%D1%82%D0%B2%D0%B5%D1%80%D0%B6%D0%B4%D0%B5%D0%BD%D0%B8%D1%8F-%D0%B2-%D1%80%D0%B5%D0%B4%D0%B0%D0%BA%D1%82%D0%BE%D1%80%D0%B5"
              >
                Да зачем эти ваши модалки нужны! Поддержите петицию!
              </a>
            </Box>
          }
          runOnClose={() => {
            if (!transitionFromMap) {
              deleteStage(storeStage?.id);
            } else {
              deletePoint();
            }
          }}
        />
      </Box>
    </>
  );
};

export default EditStagePopover;
