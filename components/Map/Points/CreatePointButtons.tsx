import React from "react";
import { Box, Button, Divider } from "@chakra-ui/react";

interface IProps {
  onDragStart: (event: React.DragEvent, type: string) => void;
}

const CreatePointButtons = ({ onDragStart }: IProps) => {
  return (
    <Box display="grid" gap={1} mt={2}>
      <Button
        onDragStart={(event) => onDragStart(event, "0")}
        fontWeight="normal"
        draggable
      >
        Стандартная метка квеста
      </Button>
      <Button
        onDragStart={(event) => onDragStart(event, "1")}
        fontWeight="normal"
        draggable
      >
        Метка квеста с автозапуском
      </Button>
      <Button
        onDragStart={(event) => onDragStart(event, "2")}
        fontWeight="normal"
        draggable
      >
        Скрытая метка квеста
      </Button>
      <Button
        onDragStart={(event) => onDragStart(event, "3")}
        fontWeight="normal"
        draggable
      >
        Скрытая метка квеста с автозапуском
      </Button>
      <Button
        onDragStart={(event) => onDragStart(event, "4")}
        fontWeight="normal"
        draggable
      >
        Продавец
      </Button>
      <Button
        onDragStart={(event) => onDragStart(event, "5")}
        fontWeight="normal"
        draggable
      >
        Тайник
      </Button>
      <Button
        onDragStart={(event) => onDragStart(event, "6")}
        fontWeight="normal"
        draggable
      >
        Дополнительный квест
      </Button>
      <Button
        onDragStart={(event) => onDragStart(event, "7")}
        fontWeight="normal"
        draggable
      >
        Переход на другую локацию
      </Button>
      <Divider />
      <Button
        onDragStart={(event) => onDragStart(event, "spawn")}
        fontWeight="normal"
        draggable
      >
        Отряд
      </Button>
    </Box>
  );
};

export default CreatePointButtons;
