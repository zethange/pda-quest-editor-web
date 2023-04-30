import React, { useState } from "react";
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
import { setStageToStore } from "@/store/store";
import { chapterType, stageType } from "@/store/types/types";

interface IProps {
  setEditableStage: (stage: stageType | null) => void;
  chapter: chapterType;
}

const ToStage = ({ setEditableStage, chapter }: IProps) => {
  const [selectedStage, setSelectedStage] = useState<number>(0);

  return (
    <Box px={2} display="flex" alignItems="center" gap={1}>
      <Popover>
        <PopoverTrigger>
          <Button borderRadius={0} fontWeight={1}>
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
                    setStageToStore(null);
                    setEditableStage(null);
                    const stage = chapter.stages.find(
                      (stage: stageType) => stage.id === selectedStage
                    );
                    setTimeout(() => {
                      setStageToStore(stage);
                      setEditableStage(stage || null);
                    }, 0);
                  }}
                >
                  Перейти к стадии:{" "}
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
