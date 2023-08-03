import React, { useEffect } from "react";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Switch,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "@/store/reduxHooks";
import { ISettings, setSettings } from "@/store/reduxStore/userSlice";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const settingsArray = [
  {
    title: "Не нажимать (я не шучу):",
    description: "Реально не стоит...",
    field: "danyaMod",
  },
  {
    title: "Показывать миникарту:",
    description: "Возможно увеличение фпс",
    field: "showMiniMap",
  },
  {
    title: "Рендеринг только видимых node:",
    description:
      "Рендерятся только те ноды которые видны в данный момент на экране",
    field: "onlyRenderVisibleElements",
  },
];

const SettingsDrawer: React.FC<Props> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.user.settings);

  useEffect(() => {
    let savedSettings = localStorage.getItem("settings");
    if (savedSettings) {
      const jsonSavedSettings = JSON.parse(savedSettings) as ISettings;
      dispatch(setSettings(jsonSavedSettings));
    }
  }, []);

  const onChange = (settingsChange: ISettings) => {
    dispatch(setSettings(settingsChange));
    const updatedSettings = {
      ...settings,
      ...settingsChange,
    };
    localStorage.setItem("settings", JSON.stringify(updatedSettings));
  };

  return (
    <Drawer size="md" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader borderBottomWidth="1px">Настройки</DrawerHeader>
        <DrawerBody>
          <VStack mt={1} gap={1} alignItems="left">
            {settingsArray.map((setting) => (
              <Flex gap={1} key={setting.field}>
                <Box>
                  <Tooltip label={setting.description}>{setting.title}</Tooltip>
                </Box>
                <Switch
                  mt={1}
                  isChecked={(settings as any)[setting.field]}
                  onChange={(e) => {
                    onChange({ [setting.field]: e.target.checked });
                  }}
                />
              </Flex>
            ))}
          </VStack>
        </DrawerBody>
        <DrawerFooter>
          <Button onClick={() => onClose()}>Закрыть</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default SettingsDrawer;
