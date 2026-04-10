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
import { useUnit } from "effector-react";
import { $targetMission, checkpointActionsEdited } from "@/features/mission";

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
  const [{ targetCheckpoint: index, targetMission }, editActions] = useUnit([
    $targetMission,
    checkpointActionsEdited,
  ]);
  const targetCheckpoint = targetMission.checkpoints[+index];

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
            onChangeActions={(actions: { [key: string]: string[] }) =>
              editActions({ index, actions })
            }
            noDispatch
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
