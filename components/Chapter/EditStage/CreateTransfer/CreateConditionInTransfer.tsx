import { createConditionsInTransfer } from "@/store/store";
import { useState } from "react";
import { Box, Select, Spacer } from "@chakra-ui/react";

export default function CreateConditionInTransferJsx({
  transferIndex,
  functionAdd,
}: {
  transferIndex: number;
  functionAdd: any;
}) {
  const [typeCondition, setTypeCondition] = useState<string>("has");
  const [rerender, setRerender] = useState<boolean>(false);
  const [showCreateConditionInTransfer, setShowCreateConditionInTransfer] =
    useState<boolean>(false);

  return (
    <>
      <Box display="flex">
        Условия: <Spacer />
        <button
          onClick={() => {
            setShowCreateConditionInTransfer(!showCreateConditionInTransfer);
            setRerender(!rerender);
          }}
        >
          {showCreateConditionInTransfer ? "-" : "+"}
        </button>
      </Box>
      {showCreateConditionInTransfer && (
        <Box backgroundColor="white" p={2} borderRadius={5}>
          <Select
            size="md"
            defaultValue={typeCondition}
            onChange={(event) => setTypeCondition(event.target.value)}
          >
            <option value="has">Показывать если есть параметр</option>
            <option value="!has">Показывать если нет параметра</option>
            <option value="money>=">
              Если есть большее или равное количество денег
            </option>
          </Select>
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
        </Box>
      )}
    </>
  );
}
