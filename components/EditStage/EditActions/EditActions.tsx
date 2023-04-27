import { useState } from "react";

import {
  deleteMethodInAction,
  deleteParamInAction,
  editParamInAction,
  newMethodInAction,
  storeStage,
} from "@/store/store";
import { Box, Button, Input, Select, Spacer } from "@chakra-ui/react";
import CreateParamEmpty from "@/components/EditStage/EditActions/CreateParamEmpty";
import { commandLocalizer, typeCommand } from "@/store/utils/commandsAction";

export default function EditActions() {
  const [showCreateMethod, setShowCreateMethod] = useState<boolean>(false);
  const [rerender, setRerender] = useState(false);

  const [method, setMethod] = useState<string>("add");

  return (
    <>
      <Box p={2} my={2} backgroundColor="gray.100" borderRadius="10px">
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
          <Box p={2} borderRadius="10px" backgroundColor="gray.50" my={1}>
            Создание новой команды:{" "}
            <Box display="flex" gap={1}>
              <Select
                size="md"
                onChange={(event) => setMethod(event.target.value)}
              >
                <option value="add">Добавить</option>
                <option value="remove">Удалить</option>
                <option value="xp">Добавить/удалить опыт</option>
                <option value="money">Добавить/удалить деньги</option>
                <option value="+">Увеличить отношения</option>
                <option value="-">Уменьшить отношения</option>
                <option value="reset">Сбросить</option>
              </Select>
              <Button
                colorScheme="teal"
                onClick={() => {
                  newMethodInAction(method);
                  setShowCreateMethod(false);
                }}
              >
                Сохранить
              </Button>
            </Box>
          </Box>
        )}
        <Box display="grid">
          {Object.entries(storeStage.actions).map(
            (action: any, indexMethod: number) => (
              <Box
                mt={1}
                p={2}
                backgroundColor="white"
                borderRadius="10px"
                key={indexMethod}
              >
                <Box display="flex" gap={1} mb={1}>
                  Команда:
                  <Spacer />
                  <Button
                    size="xs"
                    onClick={() => {
                      deleteMethodInAction(indexMethod);
                      setRerender(!rerender);
                    }}
                  >
                    -
                  </Button>
                </Box>
                <Input
                  readOnly={true}
                  defaultValue={commandLocalizer(action[0])}
                />
                <Box>
                  <CreateParamEmpty
                    indexAction={indexMethod}
                    type={typeCommand(action[0])}
                    setRerender={() => setRerender(!rerender)}
                  />
                  <Box display="grid" gap={1}>
                    {action[1].map((key: any, indexParam: number) => (
                      <Box display="flex" gap={1}>
                        <Input
                          defaultValue={key}
                          onChange={(e) => {
                            editParamInAction(
                              e.target.value,
                              indexMethod,
                              indexParam
                            );
                          }}
                        />
                        <Button
                          onClick={() => {
                            deleteParamInAction(indexMethod, indexParam);
                            setRerender(!rerender);
                          }}
                        >
                          -
                        </Button>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            )
          )}
        </Box>
      </Box>
    </>
  );
}
