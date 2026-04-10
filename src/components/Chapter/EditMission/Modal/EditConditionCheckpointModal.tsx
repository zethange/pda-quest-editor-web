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
import ConditionListRefactor from "@/components/Chapter/EditStage/CreateTransfer/ConditionList/ConditionListRefactor";
import { useUnit } from "effector-react";
import { $targetMission, checkpointConditionEdited } from "@/features/mission";

interface Props {
  showEditCondition: boolean;
  setShowEditCondition: (type: boolean) => void;
  customOnChange?: () => void;
}

const EditConditionCheckpointModal: React.FC<Props> = ({
  showEditCondition,
  setShowEditCondition,
  customOnChange,
}) => {
  const [{ targetCheckpoint: index, targetMission }, editCondition] = useUnit([
    $targetMission,
    checkpointConditionEdited,
  ]);
  const targetCheckpoint = targetMission.checkpoints[+index];

  return (
    <Modal
      onClose={() => setShowEditCondition(false)}
      isOpen={showEditCondition}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Редактирование условий</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <ConditionListRefactor
            condition={targetCheckpoint?.condition}
            isPoint
            index={index}
            noDispatch
            onChangeCondition={({ condition }) => {
              editCondition({ index, condition });
            }}
            customOnChange={customOnChange}
          />
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => setShowEditCondition(false)}>Закрыть</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditConditionCheckpointModal;
