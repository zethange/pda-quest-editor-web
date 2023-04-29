import deleteConditionInTransfer, {
  createConditionsInTransfer,
  createValueInCondition,
  deleteValueInCondition,
  editValueInConditions,
  storeStage,
} from "@/store/store";
import { Box, Button, Input, Select, Spacer } from "@chakra-ui/react";
import { useState } from "react";
import { conditionType } from "@/store/utils/conditionType";

export default function CreateTransfer({
  transferIndex,
}: {
  transferIndex: number;
}) {
  const [createConditionInTransfer, setCreateConditionInTransfer] =
    useState<boolean>(false);
  const [typeCondition, setTypeCondition] = useState<string>("has");
  const [showNewValue, setShowNewValue] = useState<boolean>(false);
  const [rerender, setRerender] = useState<boolean>(false);

  console.log(transferIndex);

  return (
    <>
      <Box display="flex" my={1}>
        Условия:
        <Spacer />
        <Button
          size="xs"
          colorScheme="teal"
          onClick={() =>
            setCreateConditionInTransfer(!createConditionInTransfer)
          }
        >
          {createConditionInTransfer ? "-" : "+"}
        </Button>
      </Box>
      <Box
        backgroundColor="gray.50"
        p={2}
        borderRadius={5}
        display="grid"
        gap={1}
      >
        {createConditionInTransfer && (
          <Box display="flex" gap={1}>
            <Select
              size="md"
              defaultValue={typeCondition}
              onChange={(event) => setTypeCondition(event.target.value)}
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
                createConditionsInTransfer(transferIndex, typeCondition);
                setCreateConditionInTransfer(false);
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
                      deleteConditionInTransfer(transferIndex, conditionIndex);
                      setRerender(!rerender);
                    }}
                  >
                    -
                  </Button>
                  <Button
                    size="xs"
                    mb={1}
                    colorScheme="teal"
                    onClick={() => {
                      createValueInCondition(transferIndex, conditionIndex);
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
                          onChange={(event) =>
                            editValueInConditions(
                              transferIndex,
                              conditionIndex,
                              valueIndex,
                              event.target.value
                            )
                          }
                        />
                        <Button
                          onClick={() => {
                            deleteValueInCondition(
                              transferIndex,
                              conditionIndex,
                              valueIndex
                            );
                            setRerender(!rerender);
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
