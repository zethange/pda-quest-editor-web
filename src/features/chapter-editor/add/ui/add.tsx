import { Button, ButtonGroup, IconButton, Tooltip } from "@chakra-ui/react";
import { useState } from "react";
import { IoMdAdd, IoMdRemove } from "react-icons/io";

const AddStageButton = () => {
  const [show, setShow] = useState<boolean>(false);

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
          <Button size="sm">Обычная стадия</Button>
          <Button size="sm">Стадия с действиями</Button>
          <Button size="sm">Переход на карту</Button>
          <Button size="sm">Переход с карты</Button>
        </>
      )}
    </ButtonGroup>
  );
};

export { AddStageButton };
