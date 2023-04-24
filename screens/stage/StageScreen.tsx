import {
  Button,
  Spacer,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import React from "react";
import StageEditScreenChakra from "@/screens/stage/StageEditScreenChakra";
import ChangeThemeButton from "@/components/UI/NavBar/ChangeThemeButton";
import MapScreen from "../map/MapScreen";

const StageScreen = ({
  path,
  isReady,
}: {
  path: string[];
  isReady: boolean;
}) => {
  console.log(path);
  return (
    <Tabs position="relative">
      <TabList>
        <Button
          borderRadius="none"
          fontWeight="10px"
          onClick={() => history.go(-1)}
        >
          Назад
        </Button>
        <Tab>Глава</Tab>
        <Tab>Карты</Tab>
        <Spacer />
        <ChangeThemeButton rounded={false} />
      </TabList>
      <TabIndicator mt="-1.5px" height="1px" bg="blue.500" borderRadius="1px" />
      <TabPanels>
        <TabPanel p={0}>
          <StageEditScreenChakra path={path} isReady={isReady} />
        </TabPanel>
        <TabPanel>
          <MapScreen path={path} isReady={isReady} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default StageScreen;
