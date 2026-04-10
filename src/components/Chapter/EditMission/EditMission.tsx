
import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { generateSlug } from "@/store/tools/generateSlug";
import {
  checkpointAdded as newCheckpoint,
  checkpointDeleted as deleteCheckpoint,
  checkpointEdited as editCheckpoint,
  missionEdited as editMission,
  targetCheckpointSelected as setTargetCheckpointIndex,
} from "@/features/mission";
import type { MissionCheckpoint as checkpointType } from "@/entities/mission";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";
import EditConditionCheckpointModal from "@/components/Chapter/EditMission/Modal/EditConditionCheckpointModal";
import EditActionsCheckpointModal from "@/components/Chapter/EditMission/Modal/EditActionsCheckpointModal";
import { useUnit } from "effector-react";
import { $targetMission } from "@/features/mission";
import { $parameters } from "@/features/stage-editor";

interface Props {
  handleUpdate: () => void;
}

const EditMission: React.FC<Props> = ({ handleUpdate }) => {
  const [{ targetMission }, editMissionEvent, newCheckpointEvent, editCheckpointEvent, setTargetCheckpointEvent, deleteCheckpointEvent] =
    useUnit([
      $targetMission,
      editMission,
      newCheckpoint,
      editCheckpoint,
      setTargetCheckpointIndex,
      deleteCheckpoint,
    ]);
  const parameters = useUnit($parameters);

  const [showEditCondition, setShowEditCondition] = useState(false);
  const [showEditActions, setShowEditActions] = useState(false);

  return (
    <Box
      p={2}
      display="grid"
      alignContent="baseline"
      gap={2}
      backgroundColor="gray.100"
      _dark={{
        backgroundColor: "gray.700",
      }}
      borderRadius="10px"
      h="100%"
    >
      <Card
        _dark={{
          backgroundColor: "gray.600",
        }}
      >
        <CardBody>
          <FormLabel>Название миссии:</FormLabel>
          <Input
            placeholder="Название миссии..."
            value={targetMission.title}
            required
            onChange={(e) => {
                editMissionEvent({
                  title: e.target.value,
                  name: generateSlug(e.target.value),
                });
              handleUpdate();
            }}
          />
        </CardBody>
      </Card>
      <Flex>
        <Text>Чекпоинты:</Text>
        <Spacer />
        <Button
          size="xs"
          colorScheme="teal"
          onClick={() => {
            newCheckpointEvent();
            handleUpdate();
          }}
        >
          +
        </Button>
      </Flex>
      <SimpleGrid columns={4} gap={5}>
        {targetMission?.checkpoints?.map((checkpoint, index) => (
          <Card
            variant="outline"
            _dark={{
              backgroundColor: "gray.600",
            }}
            key={index}
            p={2}
          >
            <VStack gap={2} alignItems="start">
              <FormControl>
                <FormLabel>Название чекпоинта:</FormLabel>
                <Input
                  value={checkpoint.title}
                  onChange={(e) => {
                    editCheckpointEvent({
                      index,
                      checkpoint: {
                        title: e.target.value,
                      } as checkpointType,
                    });
                    handleUpdate();
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Параметр:</FormLabel>
                <AutoComplete
                  openOnFocus
                  value={checkpoint.parameter}
                  onChange={(value) => {
                    editCheckpointEvent({
                      index,
                      checkpoint: {
                        parameter: value,
                      } as checkpointType,
                    });
                    handleUpdate();
                  }}
                >
                  <AutoCompleteInput
                    placeholder="Параметер"
                    variant="outline"
                    value={checkpoint.parameter}
                    onChange={(event) => {
                      editCheckpointEvent({
                        index,
                        checkpoint: {
                          parameter: event.target.value,
                        } as checkpointType,
                      });
                      handleUpdate();
                    }}
                  />
                  <AutoCompleteList>
                    {parameters.map((parameter, index) => (
                      <AutoCompleteItem
                        key={index}
                        value={parameter}
                        textTransform="none"
                      >
                        {parameter}
                      </AutoCompleteItem>
                    ))}
                  </AutoCompleteList>
                </AutoComplete>
              </FormControl>
              <Flex gap={2} w="100%">
                <Button
                  size="sm"
                  onClick={() => {
                    setTargetCheckpointEvent(index);
                    setShowEditCondition(true);
                  }}
                >
                  Условия
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    setTargetCheckpointEvent(index);
                    setShowEditActions(true);
                  }}
                >
                  Действия
                </Button>
                <Spacer />
                <Button
                  size="sm"
                  colorScheme="red"
                  onClick={() => {
                    deleteCheckpointEvent(index);
                    handleUpdate();
                  }}
                >
                  Удалить
                </Button>
              </Flex>
            </VStack>
          </Card>
        ))}
      </SimpleGrid>

      <EditConditionCheckpointModal
        showEditCondition={showEditCondition}
        setShowEditCondition={setShowEditCondition}
        customOnChange={handleUpdate}
      />
      <EditActionsCheckpointModal
        showEditActions={showEditActions}
        setShowEditActions={setShowEditActions}
        customOnChange={handleUpdate}
      />
    </Box>
  );
};

export default EditMission;
