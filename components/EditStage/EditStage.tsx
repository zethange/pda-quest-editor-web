import deleteConditionInTransfer, {
  createValueInCondition,
  deleteValueInCondition,
  editBackgroundInStore,
  editMessageInStore,
  editTextInStore,
  editTitleInStore,
  editTransferInStore,
  editValueInConditions,
  storeStage,
} from "@/store/store";
import { useState } from "react";
import { Form } from "react-bootstrap";
import CreateConditionInTransferJsx from "./CreateConditionInTransfer";

export default function EditStage({ data }: { data: any }) {
  const [rerender, setRerender] = useState<boolean>(false);
  const [checkBoxMessage, setCheckBoxMessage] = useState<boolean>(false);

  return (
    <>
      <div className="stage-card">
        <b>Заголовок:</b>
        <Form.Control
          as="textarea"
          defaultValue={data?.title}
          onChange={(event) => editTitleInStore(event.target.value)}
        />
      </div>
      <div className="stage-card">
        <b>Фон стадии:</b>
        <img
          src={
            storeStage?.background_url
              ? `https://files.artux.net/static/${data?.background_url}`
              : "/no_background.png"
          }
          alt=""
          width="340px"
          style={{ borderRadius: "5px" }}
        />
        <Form.Control
          as="input"
          defaultValue={data?.background_url}
          style={{ width: "340px", borderRadius: "4px" }}
          onChange={(event) => {
            editBackgroundInStore(event.target.value);
            setRerender(!rerender);
          }}
        />
      </div>
      <div className="stage-card">
        <b>Сообщение:</b>
        <div>
          Показывать сообщение:{" "}
          <input
            type="checkbox"
            onChange={() => {
              setCheckBoxMessage(!checkBoxMessage);
              if (!checkBoxMessage) editMessageInStore("Новое уведомление");
              if (checkBoxMessage) editMessageInStore("");
            }}
            checked={storeStage?.message}
          />
          {storeStage?.message && (
            <Form.Control
              as="textarea"
              defaultValue={data?.message}
              onChange={(event) => editMessageInStore(event.target.value)}
            />
          )}
        </div>
      </div>
      <div className="stage-card">
        <div style={{ display: "flex" }}>
          <b>Тексты:</b>
          <div className="mx-auto"></div>
          <button>+</button>
        </div>
        {storeStage?.texts?.map(
          (text: any, index: number) =>
            text.text && (
              <div
                className="stage-card"
                key={index}
                style={{ background: "var(--light-gray)" }}
              >
                <Form.Control
                  as="textarea"
                  defaultValue={text.text}
                  style={{ width: "320px" }}
                  onChange={(event) =>
                    editTextInStore(index, {
                      text: event.target.value,
                      condition: text.condition,
                    })
                  }
                />
              </div>
            )
        )}
      </div>
      <div className="stage-card">
        <b>Ответы:</b>
        {storeStage?.transfers?.map(
          (transfer: any, index: number) =>
            transfer.text && (
              <div
                className="stage-card"
                key={index}
                style={{ background: "var(--light-gray)" }}
              >
                <Form.Control
                  key={transfer.text}
                  as="textarea"
                  defaultValue={transfer.text}
                  style={{ width: "320px" }}
                  onChange={(event) =>
                    editTransferInStore(index, {
                      text: event.target.value,
                      stage_id: transfer.stage_id,
                      condition: transfer.condition,
                    })
                  }
                />
                <CreateConditionInTransferJsx
                  transferIndex={index}
                  functionAdd={() => setRerender(!rerender)}
                />
                {Object.entries(storeStage.transfers[index].condition).map(
                  (condition: any, conditionIndex: number) => (
                    <div className="stage-card" key={conditionIndex}>
                      <div style={{ display: "flex" }}>
                        Если
                        {condition[0] === "has"
                          ? " есть параметр:"
                          : " нет параметра:"}
                        <div className="mx-auto"></div>
                        <button
                          style={{ marginRight: "4px" }}
                          onClick={() => {
                            deleteConditionInTransfer(index, conditionIndex);
                            setRerender(!rerender);
                          }}
                        >
                          Удалить
                        </button>
                        <button
                          onClick={() => {
                            createValueInCondition(index, conditionIndex);
                            setRerender(!rerender);
                          }}
                        >
                          +
                        </button>
                      </div>
                      <ul>
                        {condition[1].map(
                          (conditionValue: any, valueIndex: number) => (
                            <li key={valueIndex}>
                              <input
                                type="text"
                                defaultValue={conditionValue}
                                onChange={(event) => {
                                  editValueInConditions(
                                    index,
                                    conditionIndex,
                                    valueIndex,
                                    event.target.value
                                  );
                                }}
                              />{" "}
                              <button
                                onClick={() => {
                                  deleteValueInCondition(
                                    index,
                                    conditionIndex,
                                    valueIndex
                                  );
                                  setRerender(!rerender);
                                }}
                              >
                                -
                              </button>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )
                )}
              </div>
            )
        )}
      </div>
    </>
  );
}
