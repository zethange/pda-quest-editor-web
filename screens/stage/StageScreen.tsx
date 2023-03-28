import {
  Button,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import React from "react";
import StageEditScreenChakra from "@/screens/stage/StageEditScreenChakra";

const StageScreen = ({
  path,
  isReady,
}: {
  path: string[];
  isReady: boolean;
}) => {
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
        <Tab>Карта</Tab>
      </TabList>
      <TabIndicator mt="-1.5px" height="1px" bg="blue.500" borderRadius="1px" />
      <TabPanels>
        <TabPanel p={0}>
          <StageEditScreenChakra path={path} isReady={isReady} />
        </TabPanel>
        <TabPanel>
          <p>Здесь была карта, но её пока нет, тяжело</p>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default StageScreen;
