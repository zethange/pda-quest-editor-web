import React from "react";
import { Box, Grid, GridItem } from "@chakra-ui/react";
import EditMissionSideBar from "@/components/Chapter/EditMission/EditMissionSideBar";
import { useRouter } from "next/router";
import { Store } from "redux";
import { RootState } from "@/store/reduxStore";
import { useStore } from "react-redux";
import store from "store2";
import EditMission from "@/components/Chapter/EditMission/EditMission";
import { useAppSelector } from "@/store/reduxHooks";

interface Props {}

const MissionScreen: React.FC<Props> = () => {
  const { query } = useRouter();
  const storeRedux: Store<RootState> = useStore();
  const isOpen = useAppSelector((state) => state.mission.targetMission.isOpen);

  const handleUpdate = () => {
    const key = `story_${query.chapter![0]}_chapter_${query.chapter![1]}`;
    const sourceChapter = store.get(key);
    store.set(key, {
      ...sourceChapter,
      missions: storeRedux.getState().mission.missions,
    });
  };

  return (
    <Grid templateColumns="repeat(6, 1fr)" gap={2}>
      <GridItem rowSpan={1}>
        <EditMissionSideBar handleUpdate={handleUpdate} />
      </GridItem>
      <GridItem rowSpan={1} colSpan={5}>
        <Box borderRadius={10} h="calc(100vh - 75px)" overflowY="auto">
          {isOpen && <EditMission handleUpdate={handleUpdate} />}
        </Box>
      </GridItem>
    </Grid>
  );
};

export default MissionScreen;
