import { useUnit } from "effector-react";
import { $stage } from "@/features/stage-editor";

import ConditionListRefactor from "@/components/Chapter/EditStage/CreateTransfer/ConditionList/ConditionListRefactor";
import { editConditionInTransfer } from "@/features/stage-editor";

export default function CreateTransfer({
  transferIndex,
}: {
  transferIndex: number;
}) {
  const storeStage = useUnit($stage);

  return (
    <ConditionListRefactor
      index={transferIndex}
      condition={storeStage?.transfers![transferIndex]?.condition}
      onChangeCondition={editConditionInTransfer}
      isPoint
    />
  );
}
