import React, { FC, useState } from "react";
import { chapterType } from "@/store/types/types";
import {
  Button,
  Card,
  CardBody,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  VStack,
  Text,
  Flex,
  Icon,
  Switch,
  Tooltip,
} from "@chakra-ui/react";
import { Log, Validator } from "@/store/validator";
import {
  AiFillFolderOpen,
  AiOutlineInfoCircle,
  AiOutlineWarning,
} from "react-icons/ai";
import { BiErrorCircle, BiFileBlank } from "react-icons/bi";

interface Props {
  chapter: chapterType;
  openStage: (stageId: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

const ValidatorDrawer: FC<Props> = ({
  openStage,
  chapter,
  onClose,
  isOpen,
}) => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [nonInfo, setNonInfo] = useState(true);

  const startValidate = () => {
    setLogs([]);

    const validator = new Validator(chapter, setLogs);
    validator.run();
  };

  return (
    <Drawer size="md" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader borderBottomWidth="1px">Линтер</DrawerHeader>
        <DrawerBody>
          <Flex gap={2}>
            <Button colorScheme="teal" onClick={() => startValidate()}>
              Запустить
            </Button>
            <Button colorScheme="red" onClick={() => setLogs([])}>
              Очистить
            </Button>
            <Flex alignItems="center" gap={2}>
              Не показывать info:{" "}
              <Switch
                isChecked={nonInfo}
                onChange={(e) => setNonInfo(e.target.checked)}
              />
            </Flex>
          </Flex>
          <VStack mt={2} gap={2} alignItems="left">
            {logs.length === 0 &&
              "Пусто, кажется все хорошо, или вы не нажимали на кнопку старт?"}
            {logs
              .filter((log) => {
                if (nonInfo && log.type === "info") {
                  return false;
                }
                return true;
              })
              .map((log) => {
                let background;
                let icon;
                switch (log.type) {
                  case "warning":
                    background = "yellow.300";
                    icon = AiOutlineWarning;
                    break;
                  case "info":
                    background = "blue.300";
                    icon = AiOutlineInfoCircle;
                    break;
                  case "error":
                    background = "red.300";
                    icon = BiErrorCircle;
                    break;
                  case "success":
                    background = "green.300";
                    icon = BiFileBlank;
                    break;
                }

                return (
                  <Card
                    variant="ghoster"
                    background={background}
                    key={log.message}
                    color="white"
                  >
                    <CardBody display="flex" alignItems="center" gap={2}>
                      <Icon as={icon} />
                      <Text>{log.message}</Text>
                      <Button variant="ghost">
                        <Tooltip label={`Открыть стадию ${log.nodeId}`}>
                          <Icon
                            as={AiFillFolderOpen}
                            color="white"
                            onClick={() => {
                              openStage(log.nodeId);
                              onClose();
                            }}
                          />
                        </Tooltip>
                      </Button>
                    </CardBody>
                  </Card>
                );
              })}
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default ValidatorDrawer;
