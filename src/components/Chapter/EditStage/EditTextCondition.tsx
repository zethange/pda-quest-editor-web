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
import { $stage, $targetText, editConditionInText } from "@/features/stage-editor";
import ConditionListRefactor from "@/components/Chapter/EditStage/CreateTransfer/ConditionList/ConditionListRefactor";
import { useUnit } from "effector-react";

interface Props {
  openCondition: boolean;
  setOpenCondition: (type: boolean) => void;
}

const EditTextCondition: React.FC<Props> = ({
  openCondition,
  setOpenCondition,
}) => {
  const [targetText, storeStage] = useUnit([$targetText, $stage]);

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
