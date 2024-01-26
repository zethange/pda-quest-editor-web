import React, { useState } from "react";
import { Box, Button, Select, Spacer } from "@chakra-ui/react";

import { useAppDispatch } from "@/store/reduxStore/reduxHooks";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import ConditionHas from "@/components/Chapter/EditStage/CreateTransfer/ConditionList/ConditionHas";
import ConditionElse from "@/components/Chapter/EditStage/CreateTransfer/ConditionList/ConditionElse";
import { logger } from "@/shared/lib/logger.ts";

export type TypeOnChangeCondition = ActionCreatorWithPayload<
  {
    index?: number;
    condition: {
      [p: string]: string[];
    };
  },
  string
>;

export const conditionMethods: [string, string, boolean?][] = [
  ["=", ""],
  ["<=", ""],
  [">=", ""],
  [">", ""],
  ["=", ""],
  ["!=", ""],
  ["has", "", false],
  ["!has", "", false],
];
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
  const [typeCondition, setTypeCondition] = useState("=");

  if (!condition) {
    condition = {};
  }

  let conditionList: {
    [key: string]: string[];
  } = JSON.parse(JSON.stringify(condition));

  const conditionEntry: [string, string[]][] = Object.entries(conditionList);

  const onChange = (conditionListCustom?: { [key: string]: string[] }) => {
    logger.info("list:", conditionList);
    if (isPoint) {
      dispatch(
        onChangeCondition({
          index,
          condition: conditionListCustom ? conditionListCustom : conditionList,
        })
      );
    } else {
      dispatch(
        onChangeCondition({
          condition: conditionListCustom ? conditionListCustom : conditionList,
        })
      );
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
              {conditionMethods.map((method, index) => (
                <option value={method[0]} key={index}>
                  {method[0]}
                </option>
              ))}
            </Select>
            <Button
              fontWeight="normal"
              onClick={() => {
                if (typeCondition === "has" || typeCondition === "!has") {
                  conditionList = {
                    ...conditionList,
                    [typeCondition]: [],
                  };
                } else {
                  conditionList = {
                    ...conditionList,
                    ["money" + typeCondition]: ["100"],
                  };
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
            (condition: [string, string[]], conditionIndex: number) => {
              if (condition[0] === "has" || condition[0] === "!has") {
                return (
                  <ConditionHas
                    key={conditionIndex}
                    condition={condition}
                    conditionList={conditionList}
                    conditionEntry={conditionEntry}
                    onChange={onChange}
                    conditionIndex={conditionIndex}
                  />
                );
              } else {
                return (
                  <ConditionElse
                    key={conditionIndex}
                    condition={condition}
                    conditionList={conditionList}
                    conditionEntry={conditionEntry}
                    onChange={onChange}
                    conditionIndex={conditionIndex}
                  />
                );
              }
            }
          )}
      </Box>
    </>
  );
};

export default ConditionListRefactor;
