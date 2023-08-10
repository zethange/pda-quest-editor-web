import React from "react";
import {
  Button,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  SimpleGrid,
} from "@chakra-ui/react";
import { nodeCreateType } from "@/store/types/nodeCreateType";

interface IProps {
  onDragStart: (event: DragEvent, type: nodeCreateType) => void;
}

const CreateStage = ({ onDragStart }: IProps) => {
  return (
    <Popover>
      <PopoverTrigger>
        <Button fontWeight="normal" size="sm">
          Создать стадию
        </Button>
      </PopoverTrigger>
      <Portal>
        <PopoverContent>
          <PopoverHeader>Создание стадии</PopoverHeader>
          <PopoverCloseButton />
          <PopoverBody>
            <SimpleGrid gap={2}>
              <Button
                fontWeight={1}
                cursor="grab"
                onDragStart={(event) => onDragStart(event, "default")}
                draggable
              >
                Обычная стадия
              </Button>
              <Button
                fontWeight={1}
                cursor="grab"
                onDragStart={(event) => onDragStart(event, "chapterEnd")}
                draggable
              >
                Стадия с действиями
              </Button>
              <Button
                fontWeight={1}
                cursor="grab"
                onDragStart={(event) => onDragStart(event, "exit")}
                draggable
              >
                Переход на карту
              </Button>
              <Button
                fontWeight={1}
                cursor="grab"
                onDragStart={(event) => onDragStart(event, "transition")}
                draggable
              >
                Переход с карты
              </Button>
            </SimpleGrid>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

export default CreateStage;
