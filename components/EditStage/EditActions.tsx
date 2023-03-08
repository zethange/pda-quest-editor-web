import useSWR from "swr";
import { fetcher } from "@/store/tools";
import { useState } from "react";

import {
  editMethodInAction,
  editParamInAction,
  newMethodInAction,
  newParamInAction,
  storeStage,
} from "@/store/store";
import CreateParam from "@/components/EditStage/EditActions/CreateParam";

export default function EditActions() {
  const { data, error, isLoading } = useSWR("/pdanetwork/items/all", fetcher);

  const [showCreateParam, setShowCreateParam] = useState<boolean>(false);
  const [showCreateMethod, setShowCreateMethod] = useState<boolean>(false);

  const [method, setMethod] = useState<string>("add");

  const arrParam: string[] = ["68", "1"];
  const onChangeNewParam = (message: string, type: string) => {
    if (type === "item") arrParam[0] = message;
    if (type === "count") arrParam[1] = message;
    console.log(arrParam.join(":"));
  };

  return (
    <div className="stage-card">
      <div style={{ display: "flex" }}>
        <b>Действия:</b>
        <div className="mx-auto"></div>
        <button onClick={() => setShowCreateMethod(!showCreateMethod)}>
          {showCreateMethod ? "-" : "+"}
        </button>
      </div>
      {showCreateMethod && (
        <div className="stage-card" style={{ background: "var(--light-gray)" }}>
          Создание новой команды:{" "}
          <select onChange={(event) => setMethod(event.target.value)}>
            <option value="add">Добавить</option>
            <option value="remove">Удалить</option>
            <option value="xp">Добавить/удалить опыт</option>
            <option value="money">Добавить/удалить деньги</option>
          </select>
          <button
            className="btn"
            onClick={() => {
              newMethodInAction(method);
              setShowCreateMethod(false);
            }}
          >
            Сохранить
          </button>
        </div>
      )}
      {Object.entries(storeStage.actions).map(
        (action: any, indexAction: number) => (
          <div
            className="stage-card"
            style={{
              background: "var(--light-gray)",
            }}
          >
            Команда:{" "}
            <select
              onChange={(e) => {
                editMethodInAction(e.target.value, indexAction);
              }}
              defaultValue={action[0]}
            >
              <option value="add">Добавить</option>
              <option value="remove">Удалить</option>
            </select>
            <div>
              <CreateParam
                data={data}
                indexAction={indexAction}
                isLoading={isLoading}
              />
              {action[1].map((key: any, index: number) => (
                <input
                  type="text"
                  defaultValue={key}
                  onChange={(e) => {
                    editParamInAction(e.target.value, indexAction, index);
                  }}
                />
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
}
