import React, { useState } from "react";
import { Text, Box, Button, Flex, Spacer, IconButton } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "@/store/reduxStore/reduxHooks";
import CreateMissionModal from "@/components/Chapter/EditMission/Modal/CreateMissionModal";
import { IoMdTrash } from "react-icons/io";
import {
  deleteMission,
  setTargetMission,
} from "@/store/reduxStore/slices/missionSlice";

interface Props {
  handleUpdate: () => void;
}

const EditMissionSideBar: React.FC<Props> = ({ handleUpdate }) => {
  const missions = useAppSelector((state) => state.mission.missions);
  const [showCreateMissionModal, setShowCreateMissionModal] = useState(false);
  const dispatch = useAppDispatch();

  return (
    <>
      <Box
        p={2}
        display="grid"
        alignContent="baseline"
        gap={2}
        backgroundColor="gray.100"
        _dark={{
          backgroundColor: "gray.700",
        }}
        borderRadius="10px"
        h="100%"
      >
        <Flex>
          <Text>Миссии:</Text>
          <Spacer />
          <Button
            colorScheme="teal"
            size="xs"
            onClick={() => setShowCreateMissionModal(true)}
          >
            +
          </Button>
          <CreateMissionModal
            showCreateMissionModal={showCreateMissionModal}
            setShowCreateMissionModal={setShowCreateMissionModal}
            handleUpdate={handleUpdate}
          />
        </Flex>
        {missions.map((mission, index) => (
          <Flex key={mission.name}>
            <Button
              variant="outline"
              me={2}
              w="100%"
              onClick={() => {
                dispatch(
                  setTargetMission({
                    targetMissionIndex: index,
                    targetMission: mission,
                  })
                );
              }}
            >
              {mission.title}
            </Button>
            <IconButton
              aria-label="Удаление миссии"
              icon={<IoMdTrash />}
              onClick={() => {
                dispatch(deleteMission(index));
                handleUpdate();
              }}
            />
          </Flex>
        ))}
      </Box>
    </>
  );
};

export default EditMissionSideBar;
