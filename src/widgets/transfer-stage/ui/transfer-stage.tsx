import { Window } from "@/shared/ui";
import { useStageStore } from "@/entities/stage-editor";
import { Box, Button, Text, Textarea } from "@chakra-ui/react";
import {
  ChapterType,
  StageTransferType,
} from "@/shared/lib/type/chapter.type.ts";
import { useChapterEditorStore } from "@/entities/chapter-editor";
import { ConditionEditorModal } from "@/widgets/condition-editor";

const TransferStageEditor = () => {
  const { transfer, setTransfer, editTransfer } = useStageStore();
  const { chapter, setChapter } = useChapterEditorStore();

  const onSave = () => {
    const copyChapter = JSON.parse(JSON.stringify(chapter)) as ChapterType;
    if (!copyChapter) return;
    const sourceStage = copyChapter.stages[transfer?.stageIndex as number];
    if (!sourceStage) return;
    sourceStage.transfers?.splice(
      transfer?.transferIndex as number,
      1,
      transfer?.transfer as StageTransferType
    );
    setChapter(copyChapter);

    onClose();
  };

  const onClose = () => {
    setTransfer({
      transfer: undefined,
      stageIndex: 0,
      transferIndex: 0,
    });
  };

  if (!transfer?.transfer) return;
  return (
    <Window
      title={`Редактор перехода`}
      height={400}
      width={300}
      top={82}
      onClose={onClose}
    >
      <Box>
        <Text>Текст:</Text>
        <Textarea
          value={transfer.transfer.text}
          onChange={(e) => editTransfer({ text: e.target.value })}
        />
      </Box>
      <Box mt={1} p={1}>
        <ConditionEditorModal
          onClose={onClose}
          showCloseButton={false}
          condition={transfer.transfer.condition}
          setCondition={(condition) => {
            editTransfer({ condition });
          }}
        />
      </Box>
      {JSON.stringify(transfer)}
      <Box mt={2}>
        <Button size="sm" onClick={onSave}>
          Сохранить
        </Button>
      </Box>
    </Window>
  );
};

export { TransferStageEditor };
