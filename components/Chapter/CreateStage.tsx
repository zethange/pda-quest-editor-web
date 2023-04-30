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

interface IProps {
  onDragStart: (event: React.DragEvent, type: "default" | "exit") => void;
}

const CreateStage = ({ onDragStart }: IProps) => {
  return (
    <Popover>
      <PopoverTrigger>
        <Button borderRadius={0} fontWeight={1}>
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
                onDragStart={(event) => onDragStart(event, "default")}
                cursor="grab"
                draggable
              >
                Обычная стадия
              </Button>
              <Button
                fontWeight={1}
                onDragStart={(event) => onDragStart(event, "exit")}
                cursor="grab"
                draggable
              >
                Переход на карту
              </Button>
            </SimpleGrid>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

export default CreateStage;
