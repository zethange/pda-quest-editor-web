import { createConditionsInTransfer } from "@/store/store";
import { useState } from "react";
import { Box, Select } from "@chakra-ui/react";

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
      <Box display="flex">
        Условия: <Box mx="auto" />
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
            onChange={(event) => setTypeCondition(Number(event.target.value))}
          >
            <option value="1">Показывать если есть параметр</option>
            <option value="2">Показывать если нет параметра</option>
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
