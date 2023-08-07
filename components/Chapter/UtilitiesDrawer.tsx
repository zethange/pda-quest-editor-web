import React, { FC, useEffect, useState } from "react";
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
  Box,
  Select,
} from "@chakra-ui/react";
import { Log, Validator } from "@/store/validator";
import {
  AiFillFolderOpen,
  AiOutlineInfoCircle,
  AiOutlineWarning,
} from "react-icons/ai";
import { BiErrorCircle, BiFileBlank } from "react-icons/bi";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from "@chakra-ui/accordion";
import { useAppSelector } from "@/store/reduxHooks";
import { FindParameter } from "@/store/utils/findParameter";

interface Props {
  chapter: chapterType;
  openStage: (stageId: string) => void;
  onClose: () => void;
  isOpen: boolean;
  logs: Log[];
  nonInfo: boolean;
}

const Logs: React.FC<Props> = ({ logs, nonInfo, onClose, openStage }) => {
  return (
    <VStack mt={2} gap={2} alignItems="left">
      {!logs.length &&
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
  );
};

const UtilitiesDrawer: FC<Props> = ({
  openStage,
  chapter,
  onClose,
  isOpen,
}) => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [logsFind, setLogsFind] = useState<Log[]>([]);
  const [nonInfo, setNonInfo] = useState(true);
  const parameters = useAppSelector((state) => state.stage.parameters);
  const [selectedParameter, setSelectedParameter] = useState<string>(
    parameters[0]
  );

  const startValidate = () => {
    setLogs([]);

    const validator = new Validator(chapter, setLogs);
    validator.run();
  };

  const startCheck = () => {
    const find = new FindParameter(chapter, selectedParameter, setLogsFind);
    find.search();
  };

  useEffect(() => {
    startCheck();
  }, [selectedParameter, isOpen]);

  return (
    <Drawer size="md" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader>Утилиты</DrawerHeader>
        <DrawerBody px={0} mx={0}>
          <Accordion allowToggle>
            <AccordionItem>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  Линтер
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
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
                <Logs
                  chapter={chapter}
                  openStage={openStage}
                  onClose={onClose}
                  isOpen={isOpen}
                  logs={logs}
                  nonInfo={nonInfo}
                />
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  Условия
                </Box>
                <AccordionIcon />
              </AccordionButton>

              <AccordionPanel>
                {parameters.length !== 0 ? (
                  <>
                    <Flex gap={2}>
                      <Select
                        value={selectedParameter}
                        onChange={(e) => setSelectedParameter(e.target.value)}
                      >
                        {parameters.map((parameter) => {
                          return (
                            <option value={parameter} key={parameter}>
                              {parameter}
                            </option>
                          );
                        })}
                      </Select>
                    </Flex>
                    <Logs
                      chapter={chapter}
                      openStage={openStage}
                      onClose={onClose}
                      isOpen={isOpen}
                      logs={logsFind}
                      nonInfo={false}
                    />
                  </>
                ) : (
                  "Кажется в этой главе нет параметров"
                )}
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default UtilitiesDrawer;
