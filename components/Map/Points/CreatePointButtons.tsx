import React from "react";
import { Box, Button } from "@chakra-ui/react";

interface IProps {
  onDragStart: (event: React.DragEvent, type: string) => void;
}

const CreatePointButtons = ({ onDragStart }: IProps) => {
  return (
    <Box display="grid" gap={1} mt={2}>
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
