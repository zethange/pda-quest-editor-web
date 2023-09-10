import { Box, Button, Spacer } from "@chakra-ui/react";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";
import React from "react";
import { useAppSelector } from "@/store/reduxStore/reduxHooks";

interface Props {
  condition: [string, string[]];
  conditionList: { [key: string]: string[] };
  conditionEntry: [string, string[]][];
  onChange: () => void;
  conditionIndex: number;
}

const ConditionHas: React.FC<Props> = ({
  condition,
  conditionList,
  conditionEntry,
  onChange,
  conditionIndex,
}) => {
  const parameters = useAppSelector((state) => state.stage.parameters);

  return (
    <Box>
      <Box display="flex" gap={1}>
        {condition[0]}
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
        {condition[1].map((conditionValue: any, valueIndex: number) => (
          <Box display="flex" gap={1} key={valueIndex}>
            <AutoComplete
              openOnFocus
              value={conditionValue}
              onChange={(value) => {
                conditionEntry[+conditionIndex][1][+valueIndex] = value;
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
                conditionEntry[+conditionIndex][1].splice(+valueIndex, 1);
                onChange();
              }}
            >
              -
            </Button>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ConditionHas;
