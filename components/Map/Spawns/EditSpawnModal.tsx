import React from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Textarea,
} from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "@/store/reduxHooks";
import {
  deleteSpawn,
  editActionsSpawn,
  editSpawn,
} from "@/store/reduxStore/mapSlice";
import { groups, strength } from "@/store/utils/groupItem";
import ConditionListRefactor from "@/components/Chapter/EditStage/CreateTransfer/ConditionListRefactor";
import EditActionsRefactor from "@/components/Chapter/EditStage/EditActions/EditActionsRefactor";

interface Props {
  showEditSpawn: boolean;
  setShowEditSpawn: (type: boolean) => void;
  updateMap: () => void;
}

const EditSpawnModal: React.FC<Props> = ({
  showEditSpawn,
  setShowEditSpawn,
  updateMap,
}) => {
  const { openSpawn, openSpawnIndex } = useAppSelector(
    (state) => state.map.openSpawn
  );
  const map = useAppSelector((state) => state.map.map);
  const dispatch = useAppDispatch();

  return (
    <Modal
      onClose={() => setShowEditSpawn(false)}
      isOpen={showEditSpawn}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Редактирование спавна</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Название отряда</FormLabel>
            <Input
              defaultValue={openSpawn.title!}
              onChange={(event) => {
                dispatch(
                  editSpawn({
                    title: event.target.value,
                  })
                );
              }}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Описание отряда</FormLabel>
            <Textarea
              defaultValue={openSpawn.description!}
              onChange={(event) => {
                dispatch(
                  editSpawn({
                    description: event.target.value,
                  })
                );
              }}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Группировка</FormLabel>
            <Select
              defaultValue={openSpawn.group}
              onChange={(event) => {
                dispatch(
                  editSpawn({
                    group: event.target.value,
                  })
                );
              }}
            >
              {groups.map((group) => (
                <option value={group[0]}>{group[1]}</option>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Мощность отряда</FormLabel>
            <Select
              defaultValue={openSpawn.strength}
              onChange={(event) => {
                dispatch(
                  editSpawn({
                    strength: event.target.value,
                  })
                );
              }}
            >
              {strength.map((strength) => (
                <option value={strength[0]}>{strength[1]}</option>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Кол-во нпс</FormLabel>
            <NumberInput
              defaultValue={openSpawn.n}
              onChange={(value) => {
                dispatch(
                  editSpawn({
                    n: String(value),
                  })
                );
              }}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
          <FormControl>
            <FormLabel>Радиус спавна</FormLabel>
            <NumberInput
              defaultValue={openSpawn.r}
              onChange={(value) => {
                dispatch(
                  editSpawn({
                    r: String(value),
                  })
                );
              }}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
          <FormControl>
            <FormLabel>Позиция</FormLabel>
            <Input
              defaultValue={openSpawn.pos}
              onChange={(event) => {
                dispatch(
                  editSpawn({
                    pos: event.target.value,
                  })
                );
              }}
            />
          </FormControl>
          {map && (
            <FormControl>
              <FormLabel>Действия</FormLabel>
              <EditActionsRefactor
                actions={map.spawns![openSpawnIndex]?.actions!}
                onChangeActions={editActionsSpawn}
              />
            </FormControl>
          )}
          <ConditionListRefactor
            condition={map.spawns![openSpawnIndex]?.condition!}
            onChangeCondition={editSpawn}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="red"
            onClick={() => {
              dispatch(deleteSpawn(openSpawnIndex));
              setShowEditSpawn(false);
              updateMap();
            }}
            me={2}
          >
            Удалить
          </Button>
          <Button onClick={() => setShowEditSpawn(false)} me={2}>
            Закрыть
          </Button>
          <Button
            onClick={() => {
              setShowEditSpawn(false);
              updateMap();
            }}
            colorScheme="teal"
          >
            Сохранить
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditSpawnModal;