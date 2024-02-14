import {
  Button,
  ButtonGroup,
  ButtonProps,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { DragEvent, useState } from "react";
import { IoMdAdd, IoMdRemove } from "react-icons/io";

export type AddStage = "DEFAULT" | "ACTION" | "FROM_MAP" | "TO_MAP";

const buttonProps = {
  cursor: "grab",
  draggable: "true",
} as ButtonProps;

const AddStageButton = () => {
  const [show, setShow] = useState<boolean>(false);

  const onDragStart = (e: DragEvent<HTMLButtonElement>, type: AddStage) => {
    e.dataTransfer.setData("application/reactflow", type);
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <ButtonGroup isAttached variant="outline">
      <Tooltip label="Создать">
        <IconButton
          size="sm"
          icon={show ? <IoMdRemove /> : <IoMdAdd />}
          aria-label="Создать"
          onClick={() => setShow(!show)}
        />
      </Tooltip>
      {show && (
        <>
          <Button
            size="sm"
            {...buttonProps}
            onDragStart={(e) => onDragStart(e, "DEFAULT")}
          >
            Обычная стадия
          </Button>
          <Button
            size="sm"
            {...buttonProps}
            onDragStart={(e) => onDragStart(e, "ACTION")}
          >
            Стадия с действиями
          </Button>
          <Button
            size="sm"
            {...buttonProps}
            onDragStart={(e) => onDragStart(e, "TO_MAP")}
          >
            Переход на карту
          </Button>
          <Button
            size="sm"
            {...buttonProps}
            onDragStart={(e) => onDragStart(e, "FROM_MAP")}
          >
            Переход с карты
          </Button>
        </>
      )}
    </ButtonGroup>
  );
};

export { AddStageButton };
