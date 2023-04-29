import React, { useEffect, useState, useCallback, useMemo } from "react";
import store from "store2";
import dagre from "dagre";

import ReactFlow, {
  applyNodeChanges,
  Background,
  Controls,
  Edge,
  MarkerType,
  MiniMap,
} from "reactflow";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  SimpleGrid,
  Spacer,
  Text,
  Textarea,
  useColorMode,
  useToast,
} from "@chakra-ui/react";

import {
  editTransferInStore,
  newTransferToStore,
  setStageToStore,
  storeStage,
} from "@/store/store";
import "reactflow/dist/style.css";

import { newStage } from "@/store/createTools";
import CustomHead from "@/components/Global/CustomHead";
import EditActions from "@/components/EditStage/EditActions/EditActions";
import { NodeStage } from "@/components/Global/StageNode";
import MapStage from "@/components/EditStage/MapStage";
import EditStage from "@/components/EditStage/EditStage";
import CreateTransfer from "@/components/EditStage/CreateTransfer/CreateTransfer";
import { chapterType, stageTransfer, stageType } from "@/store/types/types";
import Stats from "stats.js";
import TransferEdge from "@/components/Global/TransferEdge";

export default function StageEditScreenChakra({
  path,
  isReady,
}: {
  path: string[];
  isReady: boolean;
}) {
  const [chapter, setChapter] = useState<chapterType | any>();
  const { colorMode } = useColorMode();

  const [nodes, setNodes] = useState<any[]>();
  const [edges, setEdges] = useState<any[]>();

  const [editableStage, setEditableStage] = useState<stageType | any>();

  const [isOpenCreateTransfer, setIsOpenCreateTransfer] =
    useState<boolean>(false);

  const [showModalEditTransfer, setShowModalEditTransfer] =
    useState<boolean>(false);

  const [connectionInfo, setConnectionInfo] = useState<any>();
  const [transferIndex, setTransferIndex] = useState<string>("");

  const toast = useToast();

  // Вытаскивание главы из localStorage
  useEffect(() => {
    const chapterFromLocalStorage =
      path[0] && store.get(`story_${path[0]}_chapter_${path[1]}`);

    setChapter(chapterFromLocalStorage);
  }, [isReady]);

  const updateChapter = (chapter: any, all: boolean) => {
    if (all) setChapter(chapter);

    if (path[0]) {
      store.set(`story_${path[0]}_chapter_${path[1]}`, chapter, true);
    }
  };

  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  const nodeWidth = 300;
  const nodeHeight = 100;

  const getLayoutedElements = (
    nodes: any[],
    edges: any[],
    direction = "TB"
  ) => {
    const isHorizontal = direction === "LR";
    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node: any) => {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge: any) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    nodes.forEach((node: any) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      node.targetPosition = isHorizontal ? "left" : "top";
      node.sourcePosition = isHorizontal ? "right" : "bottom";

      node.position = {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      };

      return node;
    });

    return { nodes, edges };
  };

  const onLayout = useCallback(
    (direction: any) => {
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        // @ts-ignore
        getLayoutedElements(nodes, edges, direction);

      const copyChapter = store.get(`story_${path[0]}_chapter_${path[1]}`);
      layoutedNodes.map((node) => {
        const stage = copyChapter.stages.find(
          (stage: stageType) => stage.id === +node.id
        );
        if (+stage.id !== +node.id) {
          console.log(stage.id, node.id);
        }
        stage.editor = {
          x: node.position.x,
          y: node.position.y,
        };
      });

      updateChapter(copyChapter, false);
      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    },
    [nodes, edges]
  );

  // отрисовка nodes и edges
  useEffect(() => {
    const initialNodes: any[] = [];
    const initialEdges: any[] = [];

    let timer = 0;
    chapter?.stages?.map((stage: any) => {
      timer++;
      initialNodes.push({
        id: String(stage.id),
        type: "nodeStage",
        selected: false,
        data: {
          label: stage.title ? stage.title : "Переход на карту",
          onClick: () => {
            setStageToStore(null);
            setEditableStage(null);

            setTimeout(() => {
              setStageToStore(stage);
              setEditableStage(stage);
            }, 0);
          },
          text: stage.texts && stage.texts[0].text,
          id: stage.id,
          actions: stage.actions || {},
        },
        position: { x: stage.editor.x, y: stage.editor.y },
      });
    });
    console.log("Всего нод:", timer);

    chapter?.stages?.map((stage: stageType): void => {
      stage?.transfers?.map((transfer: stageTransfer): void => {
        initialEdges.push({
          id: `${stage.id}-${transfer.stage}`,
          source: String(stage.id),
          target: String(transfer.stage),
          type: "custom",
          data: {
            label: transfer.text.substring(0, 30),
            transfer,
            onClick: onEdgesClick,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
        });
      });
    });

    if (initialNodes.length !== 0) setNodes(initialNodes);
    if (initialEdges.length !== 0) setEdges(initialEdges);
  }, [chapter]);

  // передвижение node
  const onNodesChange = useCallback(
    (changes: any): void => {
      setNodes((nds: any) => applyNodeChanges(changes, nds));

      if (changes[0].position) {
        const updatedStageWithPosition = {
          ...chapter?.stages[changes[0].id],
          editor: {
            x: changes[0].position.x,
            y: changes[0].position.y,
          },
        };

        const idInitialStage = chapter?.stages?.indexOf(
          chapter.stages[changes[0].id]
        );

        const initialStages =
          path[0] && store.get(`story_${path[0]}_chapter_${path[1]}`).stages;

        initialStages?.splice(idInitialStage, 1, updatedStageWithPosition);
        console.log("да");

        updateChapter(
          {
            id: chapter.id,
            music: chapter.music,
            stages: initialStages,
          },
          false
        );
      }
    },
    [chapter]
  );

  // нажатие на edge
  const onEdgesClick = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      const chapterFromLocalStorage =
        path[0] && store.get(`story_${path[0]}_chapter_${path[1]}`);

      const stage = chapterFromLocalStorage.stages.find(
        (stage: any) => stage.id === Number(edge.source)
      );

      const targetTransfer = stage?.transfers?.find(
        (transfer: any) => transfer.stage === edge.target
      );

      const indexTargetTransfer = stage?.transfers?.indexOf(targetTransfer);
      console.log(targetTransfer, indexTargetTransfer);
      setShowModalEditTransfer(true);
      setStageToStore({ ...stage, targetTransfer, indexTargetTransfer });
    },
    [chapter]
  );

  // Создание стадии
  const createStage = (type: string): void => {
    const chapterFromLocalStorage =
      path[0] && store.get(`story_${path[0]}_chapter_${path[1]}`);

    const idLastStage =
      chapterFromLocalStorage?.stages[
        chapterFromLocalStorage?.stages?.length - 1
      ].id;

    const updatedChapter = {
      id: chapterFromLocalStorage?.id,
      music: chapterFromLocalStorage?.music,
      stages: [
        ...chapterFromLocalStorage?.stages,
        newStage(type, idLastStage + 1),
      ],
    };
    updateChapter(updatedChapter, true);
  };

  // Обновление стадии
  const updateStage = (stageId: number): void => {
    const chapterFromLocalStorage =
      path[0] && store.get(`story_${path[0]}_chapter_${path[1]}`);

    const storeStageTrueId = chapterFromLocalStorage.stages.findIndex(
      (stage: any) =>
        stage ===
        chapterFromLocalStorage.stages.find(
          (stage: any) => stage.id === stageId
        )
    );

    const updatedStageWithUpdatedPosition = {
      id: storeStage.id,
      type_stage: storeStage.type_stage,
      background: storeStage.background || "",
      title: storeStage.title,
      message: storeStage.message,
      type_message: storeStage.type_stage,
      texts: storeStage.texts,
      transfers: storeStage.transfers,
      actions: storeStage.actions,
      editor: {
        x: chapterFromLocalStorage.stages.find(
          (stage: any) => stage.id === stageId
        ).editor.x,
        y: chapterFromLocalStorage.stages.find(
          (stage: any) => stage.id === stageId
        ).editor.y,
      },
    };

    chapterFromLocalStorage.stages.splice(
      storeStageTrueId,
      1,
      updatedStageWithUpdatedPosition
    );

    updateChapter(chapterFromLocalStorage, true);
  };

  const onConnect = useCallback(
    (connection: any): void => {
      const chapterFromLocalStorage =
        path[0] && store.get(`story_${path[0]}_chapter_${path[1]}`);

      setConnectionInfo({
        source: connection.source,
        target: connection.target,
      });

      const targetTransfer = chapterFromLocalStorage?.stages[
        connection.source
      ].transfers.find((transfer: any) => transfer.stage === connection.target);

      setIsOpenCreateTransfer(true);

      setStageToStore({
        ...chapterFromLocalStorage?.stages[connection.source],
        targetTransfer,
      });
    },
    [setEdges, chapter]
  );

  function deleteStage(id: number): void {
    const chapterFromLocalStorage =
      path[0] && store.get(`story_${path[0]}_chapter_${path[1]}`);

    const indexStage = chapterFromLocalStorage?.stages?.indexOf(
      chapterFromLocalStorage?.stages?.find((stage: any) => stage.id === id)
    );

    chapterFromLocalStorage?.stages?.splice(indexStage, 1);

    chapterFromLocalStorage && updateChapter(chapterFromLocalStorage, true);
    setStageToStore(null);
    setEditableStage(null);
  }

  const nodeTypes = useMemo(() => ({ nodeStage: NodeStage }), []);
  const edgeTypes = useMemo(() => ({ custom: TransferEdge }), []);

  const [showFps, setShowFps] = useState(false);
  useEffect(() => {
    const stats = new Stats();
    stats.showPanel(0);
    if (showFps) {
      stats.dom.id = "fpsMeter";
      document.body.appendChild(stats.dom);

      const animate = () => {
        stats.begin();
        stats.end();
        requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
    } else {
      const fpsMeter = document.getElementById("fpsMeter");
      if (fpsMeter) document.body.removeChild(fpsMeter);
    }
  }, [showFps]);

  return (
    <>
      <CustomHead title={"Редактирование главы " + chapter?.id} />
      <Box
        display="flex"
        p={0}
        gap={2}
        borderBottom="1px"
        alignItems="center"
        borderBottomColor="gray.200"
      >
        <Popover>
          <PopoverTrigger>
            <Button borderRadius={0} fontWeight={1}>
              Создать стадию
            </Button>
          </PopoverTrigger>
          <Portal>
            <PopoverContent>
              <PopoverHeader>Создание стадии</PopoverHeader>
              <PopoverCloseButton />
              <PopoverBody>
                <SimpleGrid gap={2}>
                  <Button fontWeight={1} onClick={() => createStage("default")}>
                    Обычная стадия
                  </Button>
                  <Button fontWeight={1} onClick={() => createStage("exit")}>
                    Переход на карту
                  </Button>
                </SimpleGrid>
              </PopoverBody>
            </PopoverContent>
          </Portal>
        </Popover>
        <Text>Глава {chapter?.id}</Text>
        <Spacer />
        <Button
          onClick={() => {
            onLayout("TB");
          }}
          fontWeight="normal"
          borderRadius={0}
        >
          Prettify
        </Button>
        <Checkbox onChange={() => setShowFps(!showFps)} mr={1}>
          Счётчик ФПС
        </Checkbox>
      </Box>
      <Box h="calc(100vh - 83px)">
        {/* Штука для редактирования стадий */}
        {editableStage && (
          <Box
            zIndex="popover"
            p={5}
            w={450}
            borderLeft="2px"
            borderColor="gray.200"
            backgroundColor="white"
            _dark={{
              backgroundColor: "gray.900",
              color: "white",
            }}
            position="absolute"
            right="0"
            bottom="0"
          >
            {/* Панель редактирования */}
            <Box h="calc(100vh - 171px)" overflowY="scroll">
              {storeStage?.type_stage === 4 && (
                <MapStage data={storeStage?.data} />
              )}
              {storeStage?.type_stage === 0 && (
                <EditStage data={editableStage} />
              )}
              {storeStage?.actions && <EditActions />}
            </Box>
            <Flex>
              <Button
                colorScheme="teal"
                size="md"
                mt={2}
                me={2}
                onClick={() => {
                  updateStage(storeStage?.id);
                  setEditableStage(null);
                  toast({
                    title: "Стадия обновлена",
                    description:
                      "Стадия " + storeStage?.id + " была успешно обновлена",
                    status: "success",
                    containerStyle: {
                      textColor: "white",
                    },
                    duration: 1800,
                    isClosable: true,
                    position: "bottom-right",
                  });
                }}
              >
                Сохранить
              </Button>
              <Button
                size="md"
                mt={2}
                colorScheme="teal"
                onClick={() => {
                  setStageToStore(null);
                  setEditableStage(null);
                }}
              >
                Закрыть
              </Button>
              <Box m="auto" />
              <Button
                colorScheme="red"
                size="md"
                mt={2}
                onClick={() => deleteStage(storeStage?.id)}
              >
                Удалить
              </Button>
            </Flex>
          </Box>
        )}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgeClick={onEdgesClick}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          snapToGrid
          snapGrid={[10, 10]}
          edgeTypes={edgeTypes}
          fitView
        >
          <MiniMap zoomable pannable />
          <Controls />
          <Background
            color={colorMode === "light" ? "#000000" : "#ffffff"}
            style={{
              backgroundColor: colorMode === "light" ? "#f5f5f5" : "#1e293b",
            }}
            gap={20}
          />
        </ReactFlow>

        <Modal
          onClose={() => {
            setIsOpenCreateTransfer(false);
            setConnectionInfo(null);
            setTransferIndex("");
          }}
          isOpen={isOpenCreateTransfer}
          isCentered
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader fontWeight={1}>
              Создание перехода со стадии {connectionInfo?.source} на{" "}
              {connectionInfo?.target}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Textarea
                placeholder="Введите текст..."
                defaultValue={connectionInfo?.targetTransfer?.text}
                onChange={(event) => {
                  setTransferIndex(
                    String(
                      newTransferToStore({
                        text: event.target.value,
                        stage: connectionInfo?.target,
                        condition: {},
                      })
                    )
                  );
                }}
              />
              {transferIndex ? (
                <CreateTransfer transferIndex={Number(transferIndex)} />
              ) : (
                "Для добавления условий необходимо заполнить текст"
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="teal"
                onClick={() => {
                  updateStage(storeStage.id);
                  setConnectionInfo(null);
                  setTransferIndex("");
                  setIsOpenCreateTransfer(false);
                }}
                mx={2}
              >
                Сохранить
              </Button>
              <Button
                onClick={() => {
                  setTransferIndex("");
                  setConnectionInfo(null);
                  setIsOpenCreateTransfer(false);
                }}
              >
                Закрыть
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal
          onClose={() => {
            setShowModalEditTransfer(false);
          }}
          isOpen={showModalEditTransfer}
          isCentered
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader fontWeight={1}>
              Переход с {storeStage?.id} на {storeStage?.targetTransfer?.stage}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Textarea
                placeholder="Введите текст..."
                defaultValue={storeStage?.targetTransfer?.text}
                onChange={(event) => {
                  editTransferInStore(storeStage?.indexTargetTransfer, {
                    ...storeStage?.targetTransfer,
                    text: event.target.value,
                  });
                }}
              />
              <CreateTransfer transferIndex={storeStage?.indexTargetTransfer} />
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="teal"
                onClick={() => {
                  updateStage(storeStage.id);
                  setShowModalEditTransfer(false);
                }}
                mr={2}
              >
                Сохранить
              </Button>
              <Button
                colorScheme="teal"
                onClick={() => {
                  setShowModalEditTransfer(false);
                }}
              >
                Закрыть
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </>
  );
}
