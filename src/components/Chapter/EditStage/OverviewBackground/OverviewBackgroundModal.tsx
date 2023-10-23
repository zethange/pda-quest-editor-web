import { FC } from "react";
import Image from "next/image";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
} from "@chakra-ui/react";
import useFetching from "@/hooks/useFetching";
import { editStageInStore } from "@/store/reduxStore/slices/stageSlice";
import { useAppDispatch } from "@/store/reduxStore/reduxHooks";

interface Props {
  show: boolean;
  onClose: () => void;
}

const OverviewBackgroundModal: FC<Props> = ({ show, onClose }) => {
  const { data } = useFetching<string[]>("/api/getBackgrounds", {}, false);
  const dispatch = useAppDispatch();

  return (
    <Modal onClose={onClose} size="5xl" isOpen={show} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Выбор обложки стадии</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <SimpleGrid columns={3} gap={1}>
            {data?.map((data) => {
              return (
                <Image
                  key={data}
                  alt={data}
                  width={500}
                  height={300}
                  onClick={() => {
                    const dataEdit = data.split("/");
                    dataEdit.splice(0, 1);
                    dispatch(
                      editStageInStore({ background: dataEdit.join("/") })
                    );
                    onClose();
                  }}
                  src={"https://cdn.artux.net/" + data}
                />
              );
            })}
          </SimpleGrid>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Закрыть</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default OverviewBackgroundModal;
