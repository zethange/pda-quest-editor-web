import { useState } from "react";

import { Box, Button, Input, Select, Spacer } from "@chakra-ui/react";
import CreateParamEmpty from "@/components/Chapter/EditStage/EditActions/CreateParamEmpty";
import { commandLocalizer, typeCommand } from "@/store/utils/commandsAction";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteMethodInAction,
  deleteParamInMethod,
  editParamInAction,
  newMethodInAction,
} from "@/store/reduxStore/stageSlice";

export default function EditActions() {
  const [showCreateMethod, setShowCreateMethod] = useState<boolean>(false);
  const storeStage = useSelector((state: any) => state.stage.stage);
  const dispatch = useDispatch();

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
                  dispatch(newMethodInAction(method));
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
                key={JSON.stringify(action)}
              >
                <Box display="flex" gap={1} mb={1}>
                  Команда:
                  <Spacer />
                  <Button
                    size="xs"
                    onClick={() => {
                      dispatch(deleteMethodInAction({ indexMethod }));
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
                  />
                  <Box display="grid" gap={1}>
                    {action[1].map((key: any, indexParam: number) => (
                      <Box display="flex" gap={1}>
                        <Input
                          defaultValue={key}
                          onChange={(e) => {
                            dispatch(
                              editParamInAction({
                                editedParam: e.target.value,
                                indexMethod,
                                indexParam,
                              })
                            );
                          }}
                        />
                        <Button
                          onClick={() => {
                            dispatch(
                              deleteParamInMethod({ indexMethod, indexParam })
                            );
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
