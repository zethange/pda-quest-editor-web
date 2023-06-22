import React from "react";

import { Box, Button, Flex } from "@chakra-ui/react";
import { stageTypes } from "@/store/utils/stageName";
import MapStage from "@/components/Chapter/EditStage/MapStage";
import EditStage from "@/components/Chapter/EditStage/EditStage";
import EditActions from "@/components/Chapter/EditStage/EditActions/EditActions";
import { stageType } from "@/store/types/types";
import { setStageToStore, setTransition } from "@/store/reduxStore/stageSlice";
import FromMapStage from "@/components/Chapter/EditStage/FromMapStage";
import { useAppDispatch, useAppSelector } from "@/store/reduxHooks";

interface IProps {
  editableStage: stageType | undefined;
  updateStage: (stageId: number) => void;
  deleteStage: (stageId: number) => void;
  setEditableStage: (stage: stageType | undefined) => void;
  updateTransitionFromMap: () => void;
}

const EditStagePopover = ({
  editableStage,
  updateStage,
  deleteStage,
  setEditableStage,
  updateTransitionFromMap,
}: IProps) => {
  const storeStage = useAppSelector((state) => state.stage.stage);
  const transitionFromMap = useAppSelector(
    (state) => state.stage.transitionFromMap
  );
  const dispatch = useAppDispatch();

  return (
    <>
      {editableStage && (
        <Box
          zIndex="1"
          p={5}
          w={450}
          borderLeft="2px"
          borderColor="gray.200"
          backgroundColor="white"
          _dark={{
            backgroundColor: "gray.900",
            color: "white",
          }}
          position="absolute"
          right="0"
          bottom="0"
        >
          {/* Панель редактирования */}
          <Box h="calc(100vh - 171px)" overflowY="scroll">
            {transitionFromMap && <FromMapStage />}
            {stageTypes(storeStage?.type_stage) === "map" && (
              <MapStage data={storeStage?.data} />
            )}
            {stageTypes(storeStage?.type_stage) === "default" && <EditStage />}
            {storeStage?.actions && <EditActions />}
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
                dispatch(setStageToStore(null));
                dispatch(setTransition(null));
                setEditableStage(undefined);
              }}
            >
              Закрыть
            </Button>
            <Box m="auto" />
            {!transitionFromMap && (
              <Button
                colorScheme="red"
                size="md"
                mt={2}
                onClick={() => deleteStage(storeStage?.id)}
              >
                Удалить
              </Button>
            )}
          </Flex>
        </Box>
      )}
    </>
  );
};

export default EditStagePopover;
