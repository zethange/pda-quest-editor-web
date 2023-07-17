import { useAppSelector } from "@/store/reduxHooks";

import ConditionListRefactor from "@/components/Chapter/EditStage/CreateTransfer/ConditionList/ConditionListRefactor";
import { editConditionInTransfer } from "@/store/reduxStore/stageSlice";

export default function CreateTransfer({
  transferIndex,
}: {
  transferIndex: number;
}) {
  const storeStage = useAppSelector((state) => state.stage.stage);

  return (
    <ConditionListRefactor
      index={transferIndex}
      condition={storeStage?.transfers![transferIndex]?.condition}
      onChangeCondition={editConditionInTransfer}
      isPoint
    />
  );
}
