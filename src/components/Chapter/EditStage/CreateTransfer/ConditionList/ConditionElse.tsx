import { Box, Button, Input, Select, Spacer } from "@chakra-ui/react";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/store/reduxStore/reduxHooks";
import { conditionMethods } from "@/components/Chapter/EditStage/CreateTransfer/ConditionList/ConditionListRefactor";
import { logger } from "@/store/utils/logger";

interface Props {
  condition: [string, string[]];
  conditionList: {
    [key: string]: string[];
  };
  conditionEntry: [string, string[]][];
  onChange: (conditionList?: { [key: string]: string[] }) => void;
  conditionIndex: number;
}

const splitMethod = (condition: string) => {
  const regex = /([\wа-яё]+)?([<>!=]=?|=)?/i;
  const match = condition.match(regex);
  return [match![1] || "", match![2] || ""];
};

const ConditionElse: React.FC<Props> = ({
  condition,
  conditionList,
  conditionEntry,
  onChange,
  conditionIndex,
}) => {
  const [method, setMethod] = useState<string[]>();
  const parameters = useAppSelector((state) => state.stage.parameters);

  useEffect(() => {
    setMethod(splitMethod(condition[0]));
  }, [condition]);

  useEffect(() => {
    logger.info(method);
  }, [method]);

  return (
    <Box backgroundColor="white" _dark={{}} p={2} borderRadius="10px">
      <Box display="flex" gap={1}>
        {method !== undefined && (
          <>
            <AutoComplete
              openOnFocus
              value={method![0]}
              onChange={(value) => {
                conditionEntry[+conditionIndex][0] = value + method[1];
                conditionList = Object.fromEntries(conditionEntry);
                onChange(conditionList);
              }}
            >
              <AutoCompleteInput
                placeholder="Параметер"
                variant="outline"
                value={method![0]}
                onChange={(e) => {
                  conditionEntry[+conditionIndex][0] =
                    e.target.value + method[1];
                  conditionList = Object.fromEntries(conditionEntry);
                  onChange(conditionList);
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
            <Select
              value={method![1]}
              onChange={(e) => {
                conditionEntry[+conditionIndex][0] = method[0] + e.target.value;
                conditionList = Object.fromEntries(conditionEntry);
                onChange(conditionList);
              }}
            >
              {conditionMethods.map((method) => {
                if (method![2] === undefined) {
                  return (
                    <option key={method[0]} value={method[0]}>
                      {method[0]}
                    </option>
                  );
                }
              })}
            </Select>
            <Input
              defaultValue={condition[1]}
              onChange={(e) => {
                conditionEntry[+conditionIndex][1][0] = e.target.value;
                onChange();
              }}
            />
          </>
        )}
        <Spacer />
        <Button
          size="md"
          onClick={() => {
            delete conditionList[condition[0]];
            onChange();
          }}
        >
          -
        </Button>
      </Box>
    </Box>
  );
};

export default ConditionElse;
