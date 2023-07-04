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
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";

export type TypeOnChangeCondition = ActionCreatorWithPayload<
  {
    index?: number;
    condition: {
      [p: string]: string[];
    };
  },
  string
>;

interface Props {
  index?: number;
  condition: {
    [key: string]: string[];
  };
  onChangeCondition: TypeOnChangeCondition;
  isPoint?: boolean;
  customOnChange?: () => void;
}

const ConditionListRefactor: React.FC<Props> = ({
  index,
  condition,
  onChangeCondition,
  isPoint,
  customOnChange,
}) => {
  const dispatch = useAppDispatch();
  const [showCreateMethod, setShowCreateMethod] = useState(false);
  const [typeCondition, setTypeCondition] = useState("has");
  const parameters = useAppSelector((state) => state.stage.parameters);

  if (!condition) {
    condition = {};
  }

  let conditionList: {
    [key: string]: string[];
  } = JSON.parse(JSON.stringify(condition));

  const conditionEntry: [string, string[]][] = Object.entries(conditionList);

  const onChange = () => {
    if (isPoint) {
      dispatch(
        onChangeCondition({
          index,
          condition: conditionList,
        })
      );
    } else {
      dispatch(onChangeCondition({ condition: conditionList }));
    }
    if (customOnChange) {
      customOnChange();
    }
  };

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
        _dark={{
          backgroundColor: "gray.600",
        }}
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
                switch (typeCondition) {
                  case "has":
                    conditionList = {
                      ...conditionList,
                      has: ["параметр"],
                    };
                    break;
                  case "!has":
                    conditionList = {
                      ...conditionList,
                      "!has": ["параметр"],
                    };
                    break;
                  case "money>=":
                    conditionList = {
                      ...conditionList,
                      "money>=": ["100"],
                    };
                    break;
                }
                onChange();
                setShowCreateMethod(false);
              }}
            >
              Сохранить
            </Button>
          </Box>
        )}
        {condition &&
          conditionEntry.map(
            (condition: [string, string[]], conditionIndex: number) => (
              <Box>
                <Box display="flex" gap={1}>
                  {conditionType(condition[0])}
                  <Spacer />
                  <Button
                    size="xs"
                    onClick={() => {
                      delete conditionList[condition[0]];
                      onChange();
                    }}
                  >
                    -
                  </Button>
                  <Button
                    size="xs"
                    mb={1}
                    colorScheme="teal"
                    onClick={() => {
                      conditionEntry[+conditionIndex][1].push("новый_параметр");
                      onChange();
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
                            conditionEntry[+conditionIndex][1][+valueIndex] =
                              value;
                            onChange();
                          }}
                        >
                          <AutoCompleteInput
                            placeholder="Параметер"
                            variant="outline"
                            value={conditionValue}
                            onChange={(event) => {
                              conditionEntry[+conditionIndex][1][+valueIndex] =
                                event.target.value;
                              onChange();
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
                            conditionEntry[+conditionIndex][1].splice(
                              +valueIndex,
                              1
                            );
                            onChange();
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

export default ConditionListRefactor;
