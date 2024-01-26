import React, { FC, useEffect, useState } from "react";

import {
  Box,
  Button,
  Flex,
  Input,
  Select,
  Spacer,
  Tooltip,
} from "@chakra-ui/react";
import {
  commandLocalize,
  commands,
  getCommandById,
  typeCommand,
} from "@/store/utils/commandsAction";
import { useAppDispatch } from "@/store/reduxStore/reduxHooks";
import { logger } from "@/shared/lib/logger.ts";
import Item from "@/components/Chapter/EditStage/EditActions/Item/Item";
import { itemsContainerType } from "@/store/types/itemsType";
import InputItem from "@/components/Chapter/EditStage/EditActions/Item/InputItem";
import CodeMirrorItem from "@/components/Chapter/EditStage/EditActions/Item/CodeMirrorItem";
import RelationItem from "@/components/Chapter/EditStage/EditActions/Item/RelationItem";
import SelectItem from "@/components/Chapter/EditStage/EditActions/Item/SelectItem";
import { API_URL } from "@/shared/config";

interface Props {
  actions?: {
    [key: string]: string[];
  };
  onChangeActions: (actions: any) => any;

  indexRequired?: boolean;
  index?: number;
  customOnChange?: () => void;
  noDispatch?: boolean;
  withField?: boolean;
}

const EditActionsRefactor: FC<Props> = ({
  onChangeActions,
  actions,
  index,
  indexRequired,
  customOnChange,
  noDispatch = false,
  withField = false,
}) => {
  const [showCreateMethod, setShowCreateMethod] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const [method, setMethod] = useState<string>("add");

  if (!actions) {
    actions = {};
  }

  const [data, setData] = useState<itemsContainerType | undefined>(undefined);
  useEffect(() => {
    fetch(API_URL + "/api/v1/items/all", {
      headers: {
        Authorization: `Basic ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  let actionsList: { [key: string]: string[] } = JSON.parse(
    JSON.stringify(actions)
  );

  const actionsEntry: [string, string[]][] = Object.entries(actionsList);

  const onChange = () => {
    logger.info(actionsList);
    if (noDispatch) {
      onChangeActions(actionsList);
      return;
    }
    if (withField) {
      dispatch(onChangeActions({ actions: actionsList }));
    }
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
                value={method}
                onChange={(event) => setMethod(event.target.value)}
              >
                {commands.map((command, index) => (
                  <optgroup key={index} label={command.title}>
                    {command.commands.map((command) => (
                      <option value={command[0]} key={command[0]}>
                        {command[1]}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </Select>
              <Button
                colorScheme="teal"
                onClick={() => {
                  const value = getCommandById(method)![3] || "";

                  if (value) {
                    actionsList[method] = [value];
                  } else {
                    actionsList[method] = [];
                  }
                  onChange();
                  setMethod("add");
                  setShowCreateMethod(false);
                }}
              >
                Сохранить
              </Button>
            </Box>
          </Box>
        )}
        <Box display="grid">
          {Object.entries(actions).map(
            (action: [string, string[]], indexMethod: number) => (
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
                {typeCommand(action[0]) !== "null" && (
                  <Box mt={1}>
                    <Box display="flex">
                      Значения:
                      <Spacer />
                      <Flex gap={1}>
                        <Tooltip label="Создать параметр">
                          <Button
                            size="xs"
                            py={1}
                            onClick={() => {
                              newParamInMethod(indexMethod, "");
                            }}
                          >
                            +
                          </Button>
                        </Tooltip>
                        {typeCommand(action[0]) === "item" && (
                          <Tooltip label="Создать предмет">
                            <Button
                              size="xs"
                              py={1}
                              onClick={() => {
                                newParamInMethod(indexMethod, "1:1");
                              }}
                            >
                              +
                            </Button>
                          </Tooltip>
                        )}
                      </Flex>
                    </Box>
                    <Box
                      display="grid"
                      mt={action[1].length === 0 ? 0 : 1}
                      gap={1}
                    >
                      {action[1].map((key: string, indexParam: number) => (
                        <Box
                          display={action[0] === "script" ? "grid" : "flex"}
                          gap={1}
                          key={key}
                        >
                          {typeCommand(action[0]) === "codemirror" && (
                            <CodeMirrorItem
                              value={key}
                              onChange={(e) => {
                                actionsEntry[+indexMethod][1][+indexParam] = e;
                                onChange();
                              }}
                            />
                          )}
                          {typeCommand(action[0]) === "relation" && (
                            <RelationItem
                              value={key}
                              onChange={(e) => {
                                actionsEntry[+indexMethod][1][+indexParam] = e;
                                onChange();
                              }}
                            />
                          )}
                          {typeCommand(action[0]) === "item" &&
                            key.includes(":") && (
                              <Item
                                value={key}
                                data={data}
                                onChange={(e) => {
                                  actionsEntry[+indexMethod][1][+indexParam] =
                                    e;
                                  onChange();
                                }}
                              />
                            )}
                          {typeCommand(action[0]) === "item" &&
                            !key.includes(":") && (
                              <SelectItem
                                value={key}
                                onChange={(e) => {
                                  actionsEntry[+indexMethod][1][+indexParam] =
                                    e;
                                  onChange();
                                }}
                              />
                            )}
                          {typeCommand(action[0]) === "empty" && (
                            <InputItem
                              value={key}
                              onChange={(e) => {
                                actionsEntry[+indexMethod][1][+indexParam] = e;
                                onChange();
                              }}
                            />
                          )}
                          <Button
                            onClick={() => {
                              actionsEntry[+indexMethod][1].splice(
                                +indexParam,
                                1
                              );
                              onChange();
                            }}
                          >
                            -
                          </Button>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            )
          )}
        </Box>
      </Box>
    </>
  );
};

export default EditActionsRefactor;
