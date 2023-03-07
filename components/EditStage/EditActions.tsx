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

export default function EditActions() {
  const { data, error, isLoading } = useSWR("/pdanetwork/items/all", fetcher);

  const [showCreateParam, setShowCreateParam] = useState<boolean>(false);
  const [showCreateMethod, setShowCreateMethod] = useState<boolean>(false);

  const [method, setMethod] = useState<string>("add");
  const [param, setParam] = useState<string>("");

  const arrParam: any[] = ["68"];
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
          </select>
          <button className="btn" onClick={() => newMethodInAction(method)}>
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
            Операция:{" "}
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
              <div style={{ display: "flex" }}>
                Значения: <div className="mx-auto"></div>
                <button
                  onClick={() => {
                    // newParamInAction(indexAction);
                    setShowCreateParam(!showCreateParam);
                  }}
                >
                  {showCreateParam ? "-" : "+"}
                </button>
              </div>
              {showCreateParam && (
                <div>
                  <select
                    name="select"
                    onChange={(event) =>
                      onChangeNewParam(event.target.value, "item")
                    }
                    required={true}
                  >
                    {!isLoading &&
                      Object.entries(data).map((category: any) => (
                        <optgroup label={category[0]}>
                          {category[1].map((item: any) => (
                            <option value={item.baseId}>{item.title}</option>
                          ))}
                        </optgroup>
                      ))}
                  </select>
                  <input
                    style={{ width: "100px" }}
                    placeholder="Количество"
                    required={true}
                    onChange={(event) =>
                      onChangeNewParam(event.target.value, "count")
                    }
                  />
                  <button
                    className="btn"
                    onClick={() => {
                      newParamInAction(indexAction, arrParam.join(":"));
                      setShowCreateParam(false);
                    }}
                  >
                    Сохранить
                  </button>
                </div>
              )}
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
