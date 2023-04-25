import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/store/tools";

import {
  editMethodInAction,
  editParamInAction,
  newMethodInAction,
  storeStage,
} from "@/store/store";
import CreateParam from "@/components/EditStage/EditActions/CreateParam";
import { Box, Button, Input, Select } from "@chakra-ui/react";

export default function EditActions() {
  const { data, isLoading } = useSWR("/pdanetwork/items/all", fetcher);

  const [showCreateMethod, setShowCreateMethod] = useState<boolean>(false);
  const [rerender, setRerender] = useState(false);

  const [method, setMethod] = useState<string>("add");
  console.log(Object.entries(storeStage.actions));

  return (
    <>
      <Box p={2} my={2} backgroundColor="gray.100" borderRadius="10px">
        <Box display="flex">
          <b>Действия:</b>
          <Box mx="auto" />
          <Button
            colorScheme="teal"
            size="xs"
            onClick={() => setShowCreateMethod(!showCreateMethod)}
          >
            {showCreateMethod ? "-" : "+"}
          </Button>
        </Box>
        {showCreateMethod && (
          <Box p={2} borderRadius="10px" backgroundColor="gray.50">
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
        <Box display="grid" gap={2}>
          {Object.entries(storeStage.actions).map(
            (action: any, indexAction: number) => (
              <Box
                p={2}
                backgroundColor="white"
                borderRadius="10px"
                key={indexAction}
              >
                Команда:{" "}
                <Select
                  size="md"
                  onChange={(e) => {
                    editMethodInAction(e.target.value, indexAction);
                  }}
                  defaultValue={action[0]}
                >
                  <option value="add">Добавить</option>
                  <option value="remove">Удалить</option>
                  <option value="xp">Добавить/удалить опыт</option>
                  <option value="money">Добавить/удалить деньги</option>
                  <option value="+">Увеличить отношения</option>
                  <option value="-">Уменьшить отношения</option>
                  <option value="reset">Сбросить</option>
                </Select>
                <Box>
                  <CreateParam
                    data={data}
                    indexAction={indexAction}
                    isLoading={isLoading}
                    setRerender={() => setRerender(!rerender)}
                  />
                  <Box display="grid" gap={1}>
                    {action[1].map((key: any, index: number) => (
                      <Input
                        type="text"
                        defaultValue={key}
                        onChange={(e) => {
                          editParamInAction(e.target.value, indexAction, index);
                        }}
                      />
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
