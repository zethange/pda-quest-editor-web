import { FC, useState } from "react";
import { Button, Portal } from "@chakra-ui/react";
import OverviewBackgroundModal from "@/components/Chapter/EditStage/OverviewBackground/OverviewBackgroundModal";

interface Props {}

const OverviewBackgroundButton: FC<Props> = ({}) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button
        size="xs"
        fontWeight="normal"
        colorScheme="whiteAlpha"
        mt={4}
        onClick={() => setShowModal(true)}
      >
        +
      </Button>
      <Portal>
        <OverviewBackgroundModal
          show={showModal}
          onClose={() => setShowModal(false)}
        />
      </Portal>
    </>
  );
};

export default OverviewBackgroundButton;
