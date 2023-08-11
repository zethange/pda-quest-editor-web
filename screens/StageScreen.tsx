import React, { useEffect, useState } from "react";
import * as querystring from "querystring";

import {
  Button,
  Spacer,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
} from "@chakra-ui/react";

import StageEditScreen from "@/screens/stage/StageEditScreen";
import ChangeThemeButton from "@/components/UI/NavBar/ChangeThemeButton";
import MapScreen from "./MapScreen";
import MissionScreen from "@/screens/MissionScreen";
import { FallbackRender } from "@/components/Global/ErrorHandler";
import { ErrorBoundary } from "react-error-boundary";
import { useSearchParams } from "next/navigation";
import SettingsDrawer from "@/components/Chapter/SettingsDrawer";

const StageScreen = ({
  path,
  query,
  isReady,
}: {
  path: string[];
  query: querystring.ParsedUrlQuery;
  isReady: boolean;
}) => {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<number>(0);
  const { onClose, isOpen, onOpen } = useDisclosure();

  useEffect(() => {
    const _tab = searchParams.get("_tab");
    if (_tab) {
      console.log(Array.from(searchParams), _tab);
      setActiveTab(+_tab);
    }
  }, [searchParams]);

  return (
    <>
      <Tabs
        variant="unstyled"
        isLazy
        position="relative"
        index={activeTab}
        onChange={(e) => {
          const searchParams = new URLSearchParams(window.location.search);
          searchParams.set("_tab", String(e));

          window.history.replaceState(
            {},
            "",
            `${window.location.pathname}?${searchParams}`
          );
          setActiveTab(e);
        }}
      >
        <TabList
          alignItems="center"
          borderBottom="1px solid"
          borderBottomColor="gray.200"
          _dark={{
            borderBottomColor: "gray.700",
          }}
          py={1}
        >
          <Button
            fontWeight="normal"
            onClick={() => history.go(-1)}
            size="sm"
            mx={1}
          >
            Назад
          </Button>
          <Tab
            borderRadius="0.375rem"
            py="1"
            _selected={{ color: "white", bg: "blue.500" }}
          >
            Глава
          </Tab>
          <Tab
            borderRadius="0.375rem"
            py="1"
            _selected={{ color: "white", bg: "green.500" }}
          >
            Карты
          </Tab>
          <Tab
            borderRadius="0.375rem"
            py="1"
            _selected={{ color: "white", bg: "red.500" }}
          >
            Миссии
          </Tab>
          <Spacer />
          <Button fontWeight="normal" onClick={() => onOpen()} size="sm" mr={1}>
            Настройки
          </Button>
          <ChangeThemeButton rounded={false} />
        </TabList>
        {/*<TabIndicator mt="-1.5px" height="1px" bg="blue.500" borderRadius="1px" />*/}
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
      <SettingsDrawer isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default StageScreen;
