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
import { Box, Grid, Input, Select, VStack } from "@chakra-ui/react";

export default function EditActions() {
  const { data, isLoading } = useSWR("/pdanetwork/items/all", fetcher);

  const [showCreateMethod, setShowCreateMethod] = useState<boolean>(false);

  const [method, setMethod] = useState<string>("add");

  return (
    <>
      <Box p={2} my={2} backgroundColor="gray.100" borderRadius="10px">
        <Box display="flex">
          <b>Действия:</b>
          <Box mx="auto" />
          <button onClick={() => setShowCreateMethod(!showCreateMethod)}>
            {showCreateMethod ? "-" : "+"}
          </button>
        </Box>
      </Box>
      {showCreateMethod && (
        <Box className="stage-card">
          Создание новой команды:{" "}
          <Select size="md" onChange={(event) => setMethod(event.target.value)}>
            <option value="add">Добавить</option>
            <option value="remove">Удалить</option>
            <option value="xp">Добавить/удалить опыт</option>
            <option value="money">Добавить/удалить деньги</option>
          </Select>
          <button
            className="btn"
            onClick={() => {
              newMethodInAction(method);
              setShowCreateMethod(false);
            }}
          >
            Сохранить
          </button>
        </Box>
      )}
      {Object.entries(storeStage.actions).map(
        (action: any, indexAction: number) => (
          <Box
            p={2}
            my={2}
            backgroundColor="gray.100"
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
            </Select>
            <Box>
              <CreateParam
                data={data}
                indexAction={indexAction}
                isLoading={isLoading}
              />
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
        )
      )}
    </>
  );
}
