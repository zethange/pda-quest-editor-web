import React from "react";
import * as querystring from "querystring";

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

import StageEditScreen from "@/screens/stage/StageEditScreen";
import ChangeThemeButton from "@/components/UI/NavBar/ChangeThemeButton";
import MapScreen from "./MapScreen";
import MissionScreen from "@/screens/MissionScreen";

const StageScreen = ({
  path,
  query,
  isReady,
}: {
  path: string[];
  query: querystring.ParsedUrlQuery;
  isReady: boolean;
}) => {
  console.log(path);
  return (
    <Tabs position="relative" isLazy>
      <TabList alignItems="center">
        <Button
          fontWeight="normal"
          onClick={() => history.go(-1)}
          size="sm"
          ml={1}
        >
          Назад
        </Button>
        <Tab>Глава</Tab>
        <Tab>Карты</Tab>
        <Tab>Миссии</Tab>
        <Spacer />
        <ChangeThemeButton rounded={false} />
      </TabList>
      <TabIndicator mt="-1.5px" height="1px" bg="blue.500" borderRadius="1px" />
      <TabPanels>
        <TabPanel p={0}>
          <StageEditScreen path={path} query={query} isReady={isReady} />
        </TabPanel>
        <TabPanel>
          <MapScreen path={path} isReady={isReady} />
        </TabPanel>
        <TabPanel>
          <MissionScreen />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default StageScreen;
