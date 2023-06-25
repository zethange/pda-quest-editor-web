import { FC, useState } from "react";

import { Box, Button, Input, Select, Spacer } from "@chakra-ui/react";
import CreateParamEmpty from "@/components/Chapter/EditStage/EditActions/CreateParamEmpty";
import {
  commandLocalize,
  commands,
  typeCommand,
} from "@/store/utils/commandsAction";
import CodeMirror from "@uiw/react-codemirror";
import { StreamLanguage } from "@codemirror/language";
import { lua } from "@codemirror/legacy-modes/mode/lua";
import { useAppDispatch } from "@/store/reduxHooks";

interface Props {
  actions: {
    [key: string]: string[];
  };
  onChangeActions: (actions: any) => any;
  indexRequired?: boolean;
  index?: number;
  customOnChange?: () => void;
}

const EditActionsRefactor: FC<Props> = ({
  onChangeActions,
  actions,
  index,
  indexRequired,
  customOnChange,
}) => {
  const [showCreateMethod, setShowCreateMethod] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const [method, setMethod] = useState<string>("add");

  if (!actions) {
    actions = {};
  }

  let actionsList: { [key: string]: string[] } = JSON.parse(
    JSON.stringify(actions)
  );

  const actionsEntry: [string, string[]][] = Object.entries(actionsList);

  const onChange = () => {
    if (indexRequired) {
      dispatch(onChangeActions({ index, actions: actionsList }));
    } else {
      dispatch(onChangeActions(actionsList));
    }
    if (customOnChange) {
      customOnChange();
    }
  };

  const newParamInMethod = (indexMethod: number, param: string) => {
    actionsEntry[indexMethod][1].push(param);
    onChange();
  };

  return (
    <>
      <Box
        p={2}
        my={2}
        backgroundColor="gray.100"
        _dark={{
          backgroundColor: "gray.700",
        }}
        borderRadius="10px"
      >
        <Box display="flex">
          <b>Действия:</b>
          <Spacer />
          <Button
            colorScheme="teal"
            size="xs"
            onClick={() => setShowCreateMethod(!showCreateMethod)}
          >
            {showCreateMethod ? "-" : "+"}
          </Button>
        </Box>
        {showCreateMethod && (
          <Box
            p={2}
            borderRadius="10px"
            backgroundColor="gray.50"
            _dark={{
              backgroundColor: "gray.600",
            }}
            my={1}
          >
            Создание новой команды:{" "}
            <Box display="flex" gap={1}>
              <Select
                size="md"
                onChange={(event) => setMethod(event.target.value)}
              >
                {commands.map((command) => (
                  <option value={command[0]}>{command[1]}</option>
                ))}
              </Select>
              <Button
                colorScheme="teal"
                onClick={() => {
                  actionsList[method] = ["новый_параметр"];
                  onChange();
                  setShowCreateMethod(false);
                }}
              >
                Сохранить
              </Button>
            </Box>
          </Box>
        )}
        <Box display="grid">
          {Object.entries(actions).map((action: any, indexMethod: number) => (
            <Box
              mt={1}
              p={2}
              backgroundColor="white"
              _dark={{
                backgroundColor: "gray.600",
              }}
              borderRadius="10px"
              key={JSON.stringify(action)}
            >
              <Box display="flex" gap={1} mb={1}>
                Команда:
                <Spacer />
                <Button
                  size="xs"
                  onClick={() => {
                    delete actionsList[action[0]];
                    onChange();
                  }}
                >
                  -
                </Button>
              </Box>
              <Input
                readOnly={true}
                defaultValue={commandLocalize(action[0])}
              />
              <Box>
                <CreateParamEmpty
                  indexAction={indexMethod}
                  type={typeCommand(action[0])}
                  newParamInMethod={newParamInMethod}
                />
                <Box display="grid" gap={1}>
                  {action[1].map((key: any, indexParam: number) => (
                    <Box
                      display={action[0] === "script" ? "grid" : "flex"}
                      gap={1}
                    >
                      {action[0] === "script" ? (
                        <CodeMirror
                          value={key}
                          height="200px"
                          extensions={[StreamLanguage.define(lua)]}
                          onBlur={(event) => {
                            actionsEntry[+indexMethod][1][+indexParam] =
                              event.target.innerText;
                            onChange();
                          }}
                        />
                      ) : (
                        <Input
                          defaultValue={key}
                          onBlur={(e) => {
                            actionsEntry[+indexMethod][1][+indexParam] =
                              e.target.value;
                            onChange();
                          }}
                        />
                      )}
                      <Button
                        onClick={() => {
                          actionsEntry[+indexMethod][1].splice(+indexParam, 1);
                          onChange();
                        }}
                      >
                        -
                      </Button>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
};

export default EditActionsRefactor;
