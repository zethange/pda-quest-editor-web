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
import { useAppSelector } from "@/store/reduxHooks";
import { editConditionInText } from "@/store/reduxStore/stageSlice";
import ConditionListRefactor from "@/components/Chapter/EditStage/CreateTransfer/ConditionListRefactor";

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
          <ConditionListRefactor
            index={targetText?.indexTargetText}
            condition={storeStage.texts![targetText.indexTargetText]?.condition}
            onChangeCondition={editConditionInText}
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
