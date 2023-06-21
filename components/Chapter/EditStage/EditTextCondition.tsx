import React from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import ConditionList from "@/components/Chapter/EditStage/CreateTransfer/ConditionList";
import { useAppSelector } from "@/store/reduxHooks";
import {
  createConditionInText,
  createValueInText,
  deleteConditionInText,
  deleteValueInText,
  editValueInText,
} from "@/store/reduxStore/stageSlice";

interface Props {
  openCondition: boolean;
  setOpenCondition: (type: boolean) => void;
}

const EditTextCondition: React.FC<Props> = ({
  openCondition,
  setOpenCondition,
}) => {
  const targetText = useAppSelector((state) => state.stage.targetText);
  const storeStage = useAppSelector((state) => state.stage.stage);

  return (
    <Modal
      onClose={() => setOpenCondition(false)}
      isOpen={openCondition}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Создание условий</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <ConditionList
            index={targetText.indexTargetText}
            condition={storeStage.texts![targetText.indexTargetText].condition}
            createCondition={createConditionInText}
            createValue={createValueInText}
            deleteCondition={deleteConditionInText}
            deleteValue={deleteValueInText}
            editValue={editValueInText}
          />
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => setOpenCondition(false)}>Закрыть</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditTextCondition;
