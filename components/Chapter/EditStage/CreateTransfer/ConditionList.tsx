import React, { useState } from "react";
import { Box, Button, Select, Spacer } from "@chakra-ui/react";
import { conditionType } from "@/store/utils/conditionType";

import { useAppDispatch, useAppSelector } from "@/store/reduxHooks";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";

interface Props {
  index?: number;
  condition: {
    [key: string]: string[];
  };
  createCondition: (payload: any) => any;
  createValue: (payload: any) => any;
  deleteCondition: (payload: any) => any;
  deleteValue: (payload: any) => any;
  editValue: (payload: any) => any;
  isPoint?: boolean;
}

const ConditionList: React.FC<Props> = ({
  index,
  condition,
  createCondition,
  createValue,
  deleteCondition,
  deleteValue,
  editValue,
  isPoint = false,
}) => {
  const dispatch = useAppDispatch();
  const [showCreateMethod, setShowCreateMethod] = useState(false);
  const [typeCondition, setTypeCondition] = useState("has");
  const parameters = useAppSelector((state) => state.stage.parameters);

  return (
    <>
      <Box display="flex" my={1}>
        Условия:
        <Spacer />
        <Button
          size="xs"
          colorScheme="teal"
          onClick={() => setShowCreateMethod(!showCreateMethod)}
        >
          {showCreateMethod ? "-" : "+"}
        </Button>
      </Box>
      <Box
        backgroundColor="gray.50"
        p={2}
        borderRadius={5}
        display="grid"
        gap={1}
      >
        {showCreateMethod && (
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
              </option>
            </Select>
            <Button
              fontWeight="normal"
              onClick={() => {
                if (isPoint) {
                  dispatch(
                    createCondition({
                      typeCondition,
                    })
                  );
                } else {
                  dispatch(
                    createCondition({
                      index,
                      typeCondition,
                    })
                  );
                }
                setShowCreateMethod(false);
              }}
            >
              Сохранить
            </Button>
          </Box>
        )}
        {condition &&
          Object.entries(condition).map(
            (condition: any[], conditionIndex: number) => (
              <Box>
                <Box display="flex" gap={1}>
                  {conditionType(condition[0])}
                  <Spacer />
                  <Button
                    size="xs"
                    onClick={() => {
                      if (isPoint) {
                        dispatch(
                          deleteCondition({
                            conditionIndex,
                          })
                        );
                      } else {
                        dispatch(
                          deleteCondition({
                            index,
                            conditionIndex,
                          })
                        );
                      }
                    }}
                  >
                    -
                  </Button>
                  <Button
                    size="xs"
                    mb={1}
                    colorScheme="teal"
                    onClick={() => {
                      if (isPoint) {
                        dispatch(
                          createValue({
                            conditionIndex,
                          })
                        );
                      } else {
                        dispatch(
                          createValue({
                            index,
                            conditionIndex,
                          })
                        );
                      }
                    }}
                  >
                    +
                  </Button>
                </Box>
                <Box display="grid" gap="4px">
                  {condition[1].map(
                    (conditionValue: any, valueIndex: number) => (
                      <Box display="flex" gap={1}>
                        <AutoComplete
                          openOnFocus
                          value={conditionValue}
                          onChange={(value) => {
                            if (isPoint) {
                              dispatch(
                                editValue({
                                  conditionIndex,
                                  valueIndex,
                                  value: value,
                                })
                              );
                            } else {
                              dispatch(
                                editValue({
                                  index,
                                  conditionIndex,
                                  valueIndex,
                                  value: value,
                                })
                              );
                            }
                          }}
                        >
                          <AutoCompleteInput
                            placeholder="Параметер"
                            variant="outline"
                            value={conditionValue}
                            onChange={(event) => {
                              console.log(event.target.value);
                              if (isPoint) {
                                dispatch(
                                  editValue({
                                    conditionIndex,
                                    valueIndex,
                                    value: event.target.value,
                                  })
                                );
                              } else {
                                dispatch(
                                  editValue({
                                    index,
                                    conditionIndex,
                                    valueIndex,
                                    value: event.target.value,
                                  })
                                );
                              }
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
                        <Button
                          onClick={() => {
                            if (isPoint) {
                              dispatch(
                                deleteValue({
                                  conditionIndex,
                                  valueIndex,
                                })
                              );
                            } else {
                              dispatch(
                                deleteValue({
                                  index,
                                  conditionIndex,
                                  valueIndex,
                                })
                              );
                            }
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
};

export default ConditionList;
