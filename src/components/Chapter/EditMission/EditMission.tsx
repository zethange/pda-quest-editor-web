import { useAppDispatch, useAppSelector } from "@/store/reduxStore/reduxHooks";
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
  deleteCheckpoint,
  editCheckpoint,
  editMission,
  newCheckpoint,
  setTargetCheckpointIndex,
} from "@/store/reduxStore/slices/missionSlice";
import { checkpointType } from "@/store/types/story/missionType";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";
import EditConditionCheckpointModal from "@/components/Chapter/EditMission/Modal/EditConditionCheckpointModal";
import EditActionsCheckpointModal from "@/components/Chapter/EditMission/Modal/EditActionsCheckpointModal";

interface Props {
  handleUpdate: () => void;
}

const EditMission: React.FC<Props> = ({ handleUpdate }) => {
  const { targetMission } = useAppSelector(
    (state) => state.mission.targetMission
  );
  const dispatch = useAppDispatch();
  const parameters = useAppSelector((state) => state.stage.parameters);

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
              dispatch(
                editMission({
                  title: e.target.value,
                  name: generateSlug(e.target.value),
                })
              );
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
            dispatch(newCheckpoint());
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
                    dispatch(
                      editCheckpoint({
                        index,
                        checkpoint: {
                          title: e.target.value,
                        } as checkpointType,
                      })
                    );
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
                    dispatch(
                      editCheckpoint({
                        index,
                        checkpoint: {
                          parameter: value,
                        } as checkpointType,
                      })
                    );
                    handleUpdate();
                  }}
                >
                  <AutoCompleteInput
                    placeholder="Параметер"
                    variant="outline"
                    value={checkpoint.parameter}
                    onChange={(event) => {
                      dispatch(
                        editCheckpoint({
                          index,
                          checkpoint: {
                            parameter: event.target.value,
                          } as checkpointType,
                        })
                      );
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
                    dispatch(setTargetCheckpointIndex(index));
                    setShowEditCondition(true);
                  }}
                >
                  Условия
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    dispatch(setTargetCheckpointIndex(index));
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
                    dispatch(deleteCheckpoint(index));
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
