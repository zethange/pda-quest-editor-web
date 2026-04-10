import React from "react";
import { Box, Grid, GridItem } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import store from "@/store/utils/storage";
import { useUnit } from "effector-react";
import { $targetMission, missionsLoaded, missionsPersistRequested } from "@/features/mission";
import { MissionSidebarWidget } from "@/widgets/mission-sidebar";
import { MissionEditorWidget } from "@/widgets/mission-editor";

export function MissionScreenWidget() {
  const { storyId, chapterId } = useParams();
  const targetMission = useUnit($targetMission) as { isOpen: boolean };
  const loadMissions = useUnit(missionsLoaded);
  const persistMissions = useUnit(missionsPersistRequested);

  React.useEffect(() => {
    if (!storyId || !chapterId) return;
    const key = `story_${storyId}_chapter_${chapterId}`;
    const sourceChapter = store.get(key);
    loadMissions(sourceChapter?.missions || []);
  }, [storyId, chapterId, loadMissions]);

  const handleUpdate = () => {
    if (!storyId || !chapterId) return;
    persistMissions({ storyId, chapterId });
  };

  return (
    <Grid templateColumns="repeat(6, 1fr)" gap={2}>
      <GridItem rowSpan={1}>
        <MissionSidebarWidget handleUpdate={handleUpdate} />
      </GridItem>
      <GridItem rowSpan={1} colSpan={5}>
        <Box borderRadius={10} h="calc(100vh - 75px)" overflowY="auto">
          {targetMission.isOpen && <MissionEditorWidget handleUpdate={handleUpdate} />}
        </Box>
      </GridItem>
    </Grid>
  );
}
