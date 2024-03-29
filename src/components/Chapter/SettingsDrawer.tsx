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
  Input,
  Spacer,
  Switch,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "@/store/reduxStore/reduxHooks";
import { ISettings, setSettings } from "@/store/reduxStore/slices/userSlice";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface ISettingSettings {
  title: string;
  description: string;
  field: string;
  disabled?: boolean;
  type: "boolean" | "string";
}

const settingsArray: ISettingSettings[] = [
  {
    title: "Не нажимать (я не шучу):",
    description: "Реально не стоит...",
    field: "danyaMod",
    type: "boolean",
  },
  {
    title: "Показывать миникарту:",
    description: "Возможно увеличение фпс",
    field: "showMiniMap",
    type: "boolean",
  },
  {
    title: "Рендеринг только видимых нод:",
    description:
      "Рендерятся только те ноды которые видны в данный момент на экране",
    field: "onlyRenderVisibleElements",
    type: "boolean",
  },
  {
    title: "Использовать альтернативный сортировщик:",
    description: "Использовать ELK вместо Dagree при сортировке стадий",
    field: "useAlternativeDagre",
    type: "boolean",
    disabled: true,
  },
  {
    title: "Включить утилиты (beta):",
    description: "Показывает кнопку с утилитами",
    field: "enableUtilities",
    type: "boolean",
  },
  {
    title: "Использовать альтернативный просмоторщик карт:",
    description: "Написан на canvas, нестабильно вообще нестабильно",
    field: "alternativeMapViewer",
    type: "boolean",
  },
  {
    title: "Ширина ноды для сортировки:",
    description: "Нужно для сортировки",
    type: "string",
    field: "nodeWidth",
  },
  {
    title: "Высота ноды для сортировки:",
    description: "Нужно для сортировки",
    type: "string",
    field: "nodeHeight",
  },
  {
    title: "Ширина окна редактирования стадии:",
    description: "Да, чего бубнить, в пикселях",
    type: "string",
    field: "drawerEditStageWidth",
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

  const onChange = (settingsChange: any) => {
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
              <Flex gap={1} key={setting.field} alignItems="center">
                <Box>
                  <Tooltip label={setting.description}>{setting.title}</Tooltip>
                </Box>
                <Spacer />
                {setting.type === "boolean" && (
                  <Switch
                    mt={1}
                    isChecked={(settings as any)[setting.field]}
                    onChange={(e) => {
                      onChange({ [setting.field]: e.target.checked });
                    }}
                    disabled={setting.disabled ?? false}
                  />
                )}
                {setting.type === "string" && (
                  <Input
                    mt={1}
                    w={150}
                    value={(settings as any)[setting.field]}
                    onChange={(e) => {
                      onChange({ [setting.field]: e.target.value });
                    }}
                    disabled={setting.disabled ?? false}
                  />
                )}
              </Flex>
            ))}
            <Button
              colorScheme="red"
              onClick={() => {
                localStorage.removeItem("token");
                window.location.replace("/");
                window.location.reload();
              }}
            >
              Выйти из учетной записи
            </Button>
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
