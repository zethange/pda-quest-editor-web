import { useAppSelector } from "@/store/reduxHooks";
import ConditionList from "@/components/Chapter/EditStage/CreateTransfer/ConditionList";

import {
  createConditionInTransfer,
  createValueInCondition,
  deleteConditionInTransfer,
  deleteValueInCondition,
  editValueInConditions,
} from "@/store/reduxStore/stageSlice";

export default function CreateTransfer({
  transferIndex,
}: {
  transferIndex: number;
}) {
  const storeStage = useAppSelector((state) => state.stage.stage);

  return (
    <ConditionList
      index={transferIndex}
      condition={storeStage?.transfers![transferIndex]?.condition}
      createCondition={createConditionInTransfer}
      createValue={createValueInCondition}
      editValue={editValueInConditions}
      deleteCondition={deleteConditionInTransfer}
      deleteValue={deleteValueInCondition}
    />
  );
}
