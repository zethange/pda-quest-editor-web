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

export default function EditActions() {
  const { data, isLoading } = useSWR("/pdanetwork/items/all", fetcher);

  const [showCreateMethod, setShowCreateMethod] = useState<boolean>(false);

  const [method, setMethod] = useState<string>("add");

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
            key={indexAction}
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
              <option value="xp">Добавить/удалить опыт</option>
              <option value="money">Добавить/удалить деньги</option>
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
