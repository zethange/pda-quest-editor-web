import {
  Box,
  Button,
  Flex,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import { MdAdd, MdRemove } from "react-icons/md";
import { ParameterCondition } from "./parameter-condition";

export interface ConditionEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  condition: {
    [key: string]: string[];
  };
  setCondition: (condition: { [key: string]: string[] }) => void;
}

export interface ConditionProps {
  value: string[];
  onDelete: () => void;
  onChange: (newValue: string[]) => void;
}

export const keys: {
  [key: string]: string;
} = {
  has: "Есть параметр:",
  "!has": "Нет параметра:",
  "=": "=",
  "!=": "!=",
  "<": "<",
  "<=": "<=",
  ">": ">",
  ">=": ">=",
};

export const operatorType: {
  [key: string]: FC<ConditionProps>;
} = {
  has: ParameterCondition,
  "!has": ParameterCondition,
  // "=": ParameterCondition,
  // "!=": ParameterCondition,
  // "<": ParameterCondition,
  // "<=": ParameterCondition,
};

const ConditionEditorModal: FC<ConditionEditorModalProps> = ({
  isOpen,
  onClose,
  condition,
  setCondition,
}) => {
  const [addOperatorShow, setAddOperatorShow] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState("no-select");
  const [cond, setCond] = useState<typeof condition>(condition);

  useEffect(() => {
    console.log("cond", condition);
  }, [condition]);

  const close = () => {
    setCondition(cond);
    onClose();
  };

  return (
    <Modal onClose={close} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Редактирование условий</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex justifyContent="space-between">
            <Text>Условия</Text>
            <IconButton
              icon={addOperatorShow ? <MdRemove /> : <MdAdd />}
              aria-label="Добавить оператор"
              size="xs"
              colorScheme="teal"
              onClick={() => setAddOperatorShow(!addOperatorShow)}
            />
          </Flex>

          {addOperatorShow && (
            <Flex
              p={2}
              border="1px"
              gap={2}
              borderColor="gray.100"
              rounded="md"
              mt={1}
            >
              <Select
                value={selectedOperator}
                onChange={({ target: { value } }) => {
                  setSelectedOperator(value);
                }}
              >
                <option value="no-select">Не выбрано</option>
                {Object.entries(keys).map(([operator, value]) => {
                  if (Object.keys(cond).includes(operator)) return null;

                  return (
                    <option value={operator} key={operator}>
                      {value}
                    </option>
                  );
                })}
              </Select>
              <IconButton
                icon={<MdAdd />}
                aria-label="Добавить"
                colorScheme="teal"
                onClick={() => {
                  if (selectedOperator === "no-select") return;
                  setCond((cond) => ({
                    ...cond,
                    [selectedOperator]: [],
                  }));
                  setAddOperatorShow(false);
                }}
              />
            </Flex>
          )}

          {Object.entries(cond).map(([operator, values]) => (
            <Box key={operator} p={2} mt={1} bg="gray.100" rounded="md">
              <Flex gap={1}>
                <Text>{keys[operator]}</Text>
                <Spacer />
                <IconButton
                  icon={<MdRemove />}
                  aria-label="Удалить оператор"
                  size="xs"
                  colorScheme="teal"
                  onClick={() => {
                    const copyCond = JSON.parse(JSON.stringify(cond));
                    delete copyCond[operator];
                    setCond(copyCond);
                  }}
                />
                <IconButton
                  icon={<MdAdd />}
                  aria-label="Добавить значение"
                  size="xs"
                  colorScheme="teal"
                  onClick={() => {
                    setCond((cond) => ({
                      ...cond,
                      [operator]: [...(cond[operator] || []), ""],
                    }));
                  }}
                />
              </Flex>
              <Box>
                {values.map((value, index: number) => {
                  const Editor = operatorType[operator];
                  return (
                    <Editor
                      key={index}
                      value={[value]}
                      onDelete={() => {
                        const copyCond = JSON.parse(JSON.stringify(cond));
                        copyCond[operator].splice(index, 1);
                        setCond(copyCond);
                      }}
                      onChange={(value) => {
                        const copyCond = JSON.parse(JSON.stringify(cond));
                        copyCond[operator][index] = value[0];
                        setCond(copyCond);
                      }}
                    />
                  );
                })}
              </Box>
            </Box>
          ))}
        </ModalBody>
        <ModalFooter>
          <Button onClick={close}>Закрыть</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export { ConditionEditorModal };
