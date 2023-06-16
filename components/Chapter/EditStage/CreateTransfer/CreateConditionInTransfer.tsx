import { useState } from "react";
import { Box, Select, Spacer } from "@chakra-ui/react";
import { createConditionInTransfer } from "@/store/reduxStore/stageSlice";
import { useDispatch } from "react-redux";

export default function CreateConditionInTransferJsx({
  transferIndex,
  functionAdd,
}: {
  transferIndex: number;
  functionAdd: () => void;
}) {
  const [typeCondition, setTypeCondition] = useState<string>("has");
  const [showCreateConditionInTransfer, setShowCreateConditionInTransfer] =
    useState<boolean>(false);

  const dispatch = useDispatch();

  return (
    <>
      <Box display="flex">
        Условия: <Spacer />
        <button
          onClick={() => {
            setShowCreateConditionInTransfer(!showCreateConditionInTransfer);
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
              dispatch(
                createConditionInTransfer({ transferIndex, typeCondition })
              );
              setShowCreateConditionInTransfer(false);
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
