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
import EditActionsRefactor from "@/components/Chapter/EditStage/EditActions/EditActionsRefactor";
import { useAppSelector } from "@/store/reduxStore/reduxHooks";
import { editActionsInCheckpoint } from "@/store/reduxStore/slices/missionSlice";

interface Props {
  showEditActions: boolean;
  setShowEditActions: (type: boolean) => void;
  customOnChange?: () => void;
}

const EditActionsCheckpointModal: React.FC<Props> = ({
  showEditActions,
  setShowEditActions,
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
      onClose={() => setShowEditActions(false)}
      isOpen={showEditActions}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Редактирование действий</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <EditActionsRefactor
            actions={targetCheckpoint?.actions}
            onChangeActions={editActionsInCheckpoint}
            indexRequired
            index={index}
            customOnChange={customOnChange}
          />
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => setShowEditActions(false)}>Закрыть</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditActionsCheckpointModal;
