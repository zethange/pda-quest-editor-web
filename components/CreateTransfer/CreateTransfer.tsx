import {
  createConditionsInTransfer,
  editValueInConditions,
  storeStage,
} from "@/store/store";
import { useEffect, useState } from "react";

export default function CreateTransfer({
  transferIndex,
}: {
  transferIndex: number;
}) {
  const [createConditionInTransfer, setCreateConditionInTransfer] =
    useState<boolean>(false);
  const [typeCondition, setTypeCondition] = useState<number>(1);

  return (
    <>
      <span style={{ display: "flex" }}>
        Условия: <div className="mx-auto"></div>
        <button
          onClick={() =>
            setCreateConditionInTransfer(!createConditionInTransfer)
          }
        >
          {createConditionInTransfer ? "-" : "+"}
        </button>
      </span>
      <div className="stage-card">
        {createConditionInTransfer && (
          <>
            Условия:{" "}
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
                console.log(
                  createConditionsInTransfer(transferIndex, typeCondition)
                );
                setCreateConditionInTransfer(false);
              }}
            >
              Сохранить
            </button>
          </>
        )}
        {storeStage?.transfers[transferIndex]?.condition &&
          Object.entries(storeStage.transfers[transferIndex].condition).map(
            (condition: any, conditionIndex: number) => (
              <div>
                Если
                {condition[0] === "has" ? " есть параметр" : " нет параметра"}
                {condition[1].map((conditionValue: any, valueIndex: number) => (
                  <input
                    defaultValue={conditionValue}
                    onChange={(event) =>
                      editValueInConditions(
                        transferIndex,
                        conditionIndex,
                        valueIndex,
                        event.target.value
                      )
                    }
                  />
                ))}
              </div>
            )
          )}
      </div>
    </>
  );
}
