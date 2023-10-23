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
import { useAppSelector } from "@/store/reduxStore/reduxHooks";
import { editConditionInCheckpoint } from "@/store/reduxStore/slices/missionSlice";

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
  const index = useAppSelector(
    (state) => state.mission.targetMission.targetCheckpoint
  );
  const checkpointIndex = useAppSelector(
    (state) => state.mission.targetMission.targetCheckpoint
  );
  const targetCheckpoint = useAppSelector(
    (state) => state.mission.targetMission.targetMission
  ).checkpoints[+checkpointIndex];

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
            onChangeCondition={editConditionInCheckpoint}
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
