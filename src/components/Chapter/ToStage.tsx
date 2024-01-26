import {
  setStageToStore,
  setTransition,
} from "@/store/reduxStore/slices/stageSlice";
import { chapterType, stageType } from "@/store/types/story/chapterType";
import {
  Box,
  Button,
  Input,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  SimpleGrid,
} from "@chakra-ui/react";
import { useState } from "react";
import { useDispatch } from "react-redux";

interface IProps {
  setEditableStage: (stage: stageType | undefined) => void;
  chapter: chapterType;
  focusOnTheNode: (nodeId: string) => void;
}

const ToStage = ({ setEditableStage, chapter, focusOnTheNode }: IProps) => {
  const [selectedStage, setSelectedStage] = useState<number>(0);
  const dispatch = useDispatch();

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Popover>
        <PopoverTrigger>
          <Button size="sm" fontWeight="normal">
            Открыть стадию
          </Button>
        </PopoverTrigger>
        <Portal>
          <PopoverContent>
            <PopoverHeader>Создание стадии</PopoverHeader>
            <PopoverCloseButton />
            <PopoverBody>
              <SimpleGrid gap={2}>
                <Input
                  defaultValue={selectedStage}
                  py={2}
                  placeholder="ID..."
                  type="number"
                  onChange={(e) => setSelectedStage(+e.target.value)}
                />
                <Button
                  colorScheme="teal"
                  fontWeight="normal"
                  onClick={() => {
                    dispatch(setStageToStore(null));
                    dispatch(setTransition(null));
                    setEditableStage(undefined);
                    const stage = chapter.stages.find(
                      (stage: stageType) => stage.id === selectedStage
                    );
                    setTimeout(() => {
                      dispatch(setStageToStore(stage));
                      setEditableStage(stage || undefined);
                    }, 0);
                    focusOnTheNode(`${stage?.id}`);
                  }}
                >
                  Перейти к стадии
                </Button>
              </SimpleGrid>
            </PopoverBody>
          </PopoverContent>
        </Portal>
      </Popover>
    </Box>
  );
};

export default ToStage;
