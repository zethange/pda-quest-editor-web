import React from "react";
import { Box, Button, Flex } from "@chakra-ui/react";
import { stageTypes } from "@/store/utils/stageName";
import { setStageToStore, storeStage } from "@/store/store";
import MapStage from "@/components/EditStage/MapStage";
import EditStage from "@/components/EditStage/EditStage";
import EditActions from "@/components/EditStage/EditActions/EditActions";
import { stageType } from "@/store/types/types";

interface IProps {
  editableStage: stageType | null;
  updateStage: (stageId: number) => void;
  deleteStage: (stageId: number) => void;
  setEditableStage: (stage: stageType | null) => void;
}

const EditStagePopover = ({
  editableStage,
  updateStage,
  deleteStage,
  setEditableStage,
}: IProps) => {
  return (
    <>
      {editableStage && (
        <Box
          zIndex="popover"
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
            {stageTypes(storeStage?.type_stage) === "map" && (
              <MapStage data={storeStage?.data} />
            )}
            {stageTypes(storeStage?.type_stage) === "default" && (
              <EditStage data={editableStage} />
            )}
            {storeStage?.actions && <EditActions />}
          </Box>
          <Flex>
            <Button
              colorScheme="teal"
              size="md"
              mt={2}
              me={2}
              onClick={() => {
                updateStage(storeStage?.id);
                setEditableStage(null);
              }}
            >
              Сохранить
            </Button>
            <Button
              size="md"
              mt={2}
              colorScheme="teal"
              onClick={() => {
                setStageToStore(null);
                setEditableStage(null);
              }}
            >
              Закрыть
            </Button>
            <Box m="auto" />
            <Button
              colorScheme="red"
              size="md"
              mt={2}
              onClick={() => deleteStage(storeStage?.id)}
            >
              Удалить
            </Button>
          </Flex>
        </Box>
      )}
    </>
  );
};

export default EditStagePopover;
