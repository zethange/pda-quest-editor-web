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
import { FallbackRender } from "@/components/Global/ErrorHandler";
import { ErrorBoundary } from "react-error-boundary";

const StageScreen = ({
  path,
  query,
  isReady,
}: {
  path: string[];
  query: querystring.ParsedUrlQuery;
  isReady: boolean;
}) => {
  return (
    <Tabs position="relative">
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
          <ErrorBoundary FallbackComponent={FallbackRender}>
            <StageEditScreen path={path} query={query} isReady={isReady} />
          </ErrorBoundary>
        </TabPanel>
        <TabPanel>
          <ErrorBoundary FallbackComponent={FallbackRender}>
            <MapScreen path={path} isReady={isReady} />
          </ErrorBoundary>
        </TabPanel>
        <TabPanel>
          <MissionScreen />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default StageScreen;
