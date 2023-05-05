import { Box, Button, Input, Select, Spacer } from "@chakra-ui/react";
import { useState } from "react";
import { conditionType } from "@/store/utils/conditionType";
import { useDispatch, useSelector } from "react-redux";
import {
  createConditionInTransfer,
  createValueInCondition,
  deleteConditionInTransfer,
  deleteValueInCondition,
  editValueInConditions,
} from "@/store/reduxStore/stageSlice";

export default function CreateTransfer({
  transferIndex,
}: {
  transferIndex: number;
}) {
  const [showCreateConditionInTransfer, setShowCreateConditionInTransfer] =
    useState<boolean>(false);
  const [typeCondition, setTypeCondition] = useState<string>("has");
  const [showNewValue, setShowNewValue] = useState<boolean>(false);

  const storeStage = useSelector((state: any) => state.stage.stage);
  const dispatch = useDispatch();

  return (
    <>
      <Box display="flex" my={1}>
        Условия:
        <Spacer />
        <Button
          size="xs"
          colorScheme="teal"
          onClick={() =>
            setShowCreateConditionInTransfer(!showCreateConditionInTransfer)
          }
        >
          {showCreateConditionInTransfer ? "-" : "+"}
        </Button>
      </Box>
      <Box
        backgroundColor="gray.50"
        p={2}
        borderRadius={5}
        display="grid"
        gap={1}
      >
        {showCreateConditionInTransfer && (
          <Box display="flex" gap={1}>
            <Select
              size="md"
              defaultValue={typeCondition}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                setTypeCondition(event.target.value)
              }
            >
              <option value="has">Показывать если есть параметр</option>
              <option value="!has">Показывать если нет параметра</option>
              <option value="money>=">
                Если есть большее или равное количество денег
              </option>{" "}
            </Select>
            <Button
              fontWeight="normal"
              onClick={() => {
                dispatch(
                  createConditionInTransfer({ transferIndex, typeCondition })
                );
                setShowCreateConditionInTransfer(false);
              }}
            >
              Сохранить
            </Button>
          </Box>
        )}
        {storeStage?.transfers[transferIndex]?.condition &&
          Object.entries(storeStage.transfers[transferIndex].condition).map(
            (condition: any, conditionIndex: number) => (
              <Box>
                <Box display="flex" gap={1}>
                  {conditionType(condition[0])}
                  <Spacer />
                  <Button
                    size="xs"
                    onClick={() => {
                      dispatch(
                        deleteConditionInTransfer({
                          transferIndex,
                          conditionIndex,
                        })
                      );
                    }}
                  >
                    -
                  </Button>
                  <Button
                    size="xs"
                    mb={1}
                    colorScheme="teal"
                    onClick={() => {
                      dispatch(
                        createValueInCondition({
                          transferIndex,
                          conditionIndex,
                        })
                      );
                      setShowNewValue(!showNewValue);
                    }}
                  >
                    +
                  </Button>
                </Box>
                <Box display="grid" gap="4px">
                  {condition[1].map(
                    (conditionValue: any, valueIndex: number) => (
                      <Box display="flex" gap={1}>
                        <Input
                          defaultValue={conditionValue}
                          onChange={(
                            event: React.ChangeEvent<HTMLInputElement>
                          ) =>
                            dispatch(
                              editValueInConditions({
                                transferIndex,
                                conditionIndex,
                                valueIndex,
                                value: event.target.value,
                              })
                            )
                          }
                        />
                        <Button
                          onClick={() => {
                            dispatch(
                              deleteValueInCondition({
                                transferIndex,
                                conditionIndex,
                                valueIndex,
                              })
                            );
                          }}
                        >
                          -
                        </Button>
                      </Box>
                    )
                  )}
                </Box>
              </Box>
            )
          )}
      </Box>
    </>
  );
}
