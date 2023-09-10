import React, { useState } from "react";
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
} from "@chakra-ui/react";
import { generateSlug } from "@/store/tools/generateSlug";
import { useAppDispatch } from "@/store/reduxStore/reduxHooks";
import { newMission } from "@/store/reduxStore/slices/missionSlice";

interface Props {
  showCreateMissionModal: boolean;
  setShowCreateMissionModal: (type: boolean) => void;
  handleUpdate: () => void;
}

const CreateMissionModal: React.FC<Props> = ({
  showCreateMissionModal,
  setShowCreateMissionModal,
  handleUpdate,
}) => {
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const dispatch = useAppDispatch();

  return (
    <Modal
      onClose={() => setShowCreateMissionModal(false)}
      isOpen={showCreateMissionModal}
      isCentered
    >
      <ModalOverlay />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          dispatch(
            newMission({
              title,
              name,
              checkpoints: [],
            })
          );
          handleUpdate();
          setShowCreateMissionModal(false);
        }}
      >
        <ModalContent>
          <ModalHeader>Создание миссии</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Название миссии:</FormLabel>
              <Input
                placeholder="Название миссии..."
                value={title}
                required
                onChange={(e) => {
                  setTitle(e.target.value);
                  setName(generateSlug(e.target.value));
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Тех. название миссии:</FormLabel>
              <Input
                placeholder="Тех. название миссии..."
                value={name}
                required
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setShowCreateMissionModal(false)} me={2}>
              Закрыть
            </Button>
            <Button colorScheme="teal" type="submit">
              Создать
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};

export default CreateMissionModal;
