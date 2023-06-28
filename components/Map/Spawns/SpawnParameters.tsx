import React, { useState } from "react";
import { useAppDispatch } from "@/store/reduxHooks";
import {
  Box,
  Button,
  Flex,
  Input,
  Select,
  Spacer,
  Text,
} from "@chakra-ui/react";

export const parameters: [string, string][] = [
  ["immortal", "Бессмертие НПС спавна"],
  ["untarget", "Невозможность игрока прицелится"],
  ["angryOnPlayer", "Принудительная агрессия на игрока"],
  ["angry", "Агрессия НПС на всех"],
  ["ignorePlayer", "Игнор НПС на игрока"],
  ["alwaysIgnored", "Игнор всеми, не смотря на отношения"],
  ["hide", "Скрыть контрольную точку"],
];

const getParameterName = (parameter: string) => {
  return parameters.find((parameterFind) => parameterFind[0] === parameter)![1];
};

interface Props {
  spawnParameters: {
    [key: string]: string[];
  };
  onChangeParameters: (type: any) => any;
}

const SpawnParameters: React.FC<Props> = ({
  spawnParameters,
  onChangeParameters,
}) => {
  const [showCreateNewParameter, setShowCreateNewParameter] = useState(false);
  const [newParameter, setNewParameter] = useState("immortal");
  const dispatch = useAppDispatch();

  if (!spawnParameters) {
    spawnParameters = {};
  }

  const spawnList = JSON.parse(JSON.stringify(spawnParameters));
  const spawnEntry: [string, string[]][] = Object.entries(spawnList);

  const onChange = () => {
    console.log(spawnList);
    dispatch(onChangeParameters(spawnList));
  };

  return (
    <Box p={2} backgroundColor="gray.100" borderRadius="10px">
      <Flex>
        <Text>Параметры спавна</Text>
        <Spacer />
        <Button
          size="xs"
          onClick={() => {
            setShowCreateNewParameter(!showCreateNewParameter);
          }}
          colorScheme="teal"
        >
          {showCreateNewParameter ? "-" : "+"}
        </Button>
      </Flex>
      {showCreateNewParameter && (
        <Box display="flex" gap={1} mt={1}>
          <Select
            value={newParameter}
            onChange={(e) => setNewParameter(e.target.value)}
          >
            {parameters.map((parameter) => (
              <option value={parameter[0]}>{parameter[1]}</option>
            ))}
          </Select>
          <Button
            fontWeight="normal"
            variant="outline"
            onClick={() => {
              setShowCreateNewParameter(false);
              spawnList[newParameter] = [];
              onChange();
            }}
            colorScheme="teal"
          >
            Сохранить
          </Button>
        </Box>
      )}
      <Box mt={1} display="grid" gap={1}>
        {spawnEntry.map((parameter) => {
          return (
            <Flex gap={1}>
              <Input readOnly value={getParameterName(parameter[0])} />
              <Button
                fontWeight="normal"
                onClick={() => {
                  delete spawnList[parameter[0]];
                  onChange();
                }}
                variant="outline"
              >
                -
              </Button>
            </Flex>
          );
        })}
      </Box>
    </Box>
  );
};

export default SpawnParameters;
