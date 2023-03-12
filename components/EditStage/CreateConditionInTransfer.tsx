import { createConditionsInTransfer } from "@/store/store";
import { useState } from "react";

export default function CreateConditionInTransferJsx({
  transferIndex,
  functionAdd,
}: {
  transferIndex: number;
  functionAdd: any;
}) {
  const [typeCondition, setTypeCondition] = useState<number>(1);
  const [rerender, setRerender] = useState<boolean>(false);
  const [showCreateConditionInTransfer, setShowCreateConditionInTransfer] =
    useState<boolean>(false);

  return (
    <>
      <div style={{ display: "flex" }}>
        Условия <div className="mx-auto"></div>
        <button
          onClick={() => {
            setShowCreateConditionInTransfer(!showCreateConditionInTransfer);
            setRerender(!rerender);
          }}
        >
          {showCreateConditionInTransfer ? "-" : "+"}
        </button>
      </div>
      {showCreateConditionInTransfer && (
        <div>
          <select
            onChange={(event) => setTypeCondition(Number(event.target.value))}
          >
            <option value="1">Показывать если есть параметр</option>
            <option value="2">Показывать если нет параметра</option>
          </select>
          <button
            className="btn"
            style={{ padding: "1px" }}
            onClick={() => {
              createConditionsInTransfer(transferIndex, typeCondition);
              setShowCreateConditionInTransfer(false);
              setRerender(false);
              functionAdd();
            }}
          >
            Сохранить
          </button>
        </div>
      )}
    </>
  );
}
