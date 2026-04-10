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
import { ErrorBoundary } from "react-error-boundary";
import { useSearchParams } from "react-router-dom";
import { FallbackRender } from "@/components/Global/ErrorHandler";
import ChangeThemeButton from "@/components/UI/NavBar/ChangeThemeButton";
import SettingsDrawer from "@/components/Chapter/SettingsDrawer";
import StageEditScreen from "@/screens/stage/StageEditScreen";
import { MapScreenWidget } from "@/widgets/map-screen";
import { MissionScreenWidget } from "@/widgets/mission-screen";
import { logger } from "@/store/utils/logger";

interface ChapterEditorTabsWidgetProps {
  path: string[];
  query: querystring.ParsedUrlQuery;
  isReady: boolean;
}

export function ChapterEditorTabsWidget({
  path,
  query,
  isReady,
}: ChapterEditorTabsWidgetProps) {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<number>(0);
  const { onClose, isOpen, onOpen } = useDisclosure();

  useEffect(() => {
    const tab = searchParams.get("_tab");
    if (tab) {
      logger.info(Array.from(searchParams), tab);
      setActiveTab(+tab);
    }
  }, [searchParams]);

  return (
    <>
      <Tabs
        variant="unstyled"
        isLazy
        position="relative"
        index={activeTab}
        onChange={(nextTab) => {
          const params = new URLSearchParams(window.location.search);
          params.set("_tab", String(nextTab));
          window.history.replaceState({}, "", `${window.location.pathname}?${params}`);
          setActiveTab(nextTab);
        }}
      >
        <TabList
          alignItems="center"
          borderBottom="1px solid"
          borderBottomColor="gray.200"
          _dark={{ borderBottomColor: "gray.700" }}
          py={1}
        >
          <Button fontWeight="normal" onClick={() => history.go(-1)} size="sm" mx={1}>
            Назад
          </Button>
          <Tab borderRadius="0.375rem" py="1" _selected={{ color: "white", bg: "blue.500" }}>
            Глава
          </Tab>
          <Tab borderRadius="0.375rem" py="1" _selected={{ color: "white", bg: "green.500" }}>
            Карты
          </Tab>
          <Tab borderRadius="0.375rem" py="1" _selected={{ color: "white", bg: "red.500" }}>
            Миссии
          </Tab>
          <Spacer />
          <Button fontWeight="normal" onClick={() => onOpen()} size="sm" mr={1}>
            Настройки
          </Button>
          <ChangeThemeButton rounded={false} />
        </TabList>
        <TabPanels>
          <TabPanel p={0}>
            <ErrorBoundary FallbackComponent={FallbackRender}>
              <StageEditScreen path={path} query={query} isReady={isReady} />
            </ErrorBoundary>
          </TabPanel>
          <TabPanel>
            <ErrorBoundary FallbackComponent={FallbackRender}>
              <MapScreenWidget path={path} isReady={isReady} />
            </ErrorBoundary>
          </TabPanel>
          <TabPanel>
            <MissionScreenWidget />
          </TabPanel>
        </TabPanels>
      </Tabs>
      <SettingsDrawer isOpen={isOpen} onClose={onClose} />
    </>
  );
}
