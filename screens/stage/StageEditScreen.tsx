import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import store from "store2";
import querystring from "querystring";
import dagre from "dagre";
import { v4 as uuidv4, validate as uuidValidate } from "uuid";
import Stats from "stats.js";

import ReactFlow, {
  applyNodeChanges,
  Background,
  Controls,
  Edge,
  MarkerType,
  MiniMap,
  Node,
} from "reactflow";

import {
  Box,
  Button,
  Checkbox,
  Spacer,
  Text,
  useColorMode,
} from "@chakra-ui/react";

import "reactflow/dist/style.css";
import { newStage } from "@/store/tools/createTools";
import CustomHead from "@/components/Global/CustomHead";
import { NodeStage } from "@/components/Global/StageNode";
import { chapterType, stageTransfer, stageType } from "@/store/types/types";
import TransferEdge from "@/components/Global/TransferEdge";
import { stageName } from "@/store/utils/stageName";
import ToStage from "@/components/Chapter/ToStage";
import CreateStage from "@/components/Chapter/CreateStage";
import CreateTransferModal from "@/components/Chapter/EditStage/CreateTransferModal";
import EditTransferModal from "@/components/Chapter/EditStage/EditTransferModal";
import EditStagePopover from "@/components/Chapter/EditStage/EditStagePopover";
import { useStore } from "react-redux";
import {
  setConnection,
  setStageToStore as setStageToRedux,
  setTargetTransfer,
  setTransition,
  setTransitionToStore,
} from "@/store/reduxStore/stageSlice";
import { setMaps } from "@/store/reduxStore/chapterMapsSlice";
import { Store } from "redux";
import { RootState } from "@/store/reduxStore";
import { mapType, pointType } from "@/store/types/mapType";
import EditTransitionModal from "@/components/Chapter/EditStage/EditTransitionModal";
import { useAppDispatch, useAppSelector } from "@/store/reduxHooks";

export default function StageEditScreen({
  path,
  isReady,
  query,
}: {
  path: string[];
  query: querystring.ParsedUrlQuery;
  isReady: boolean;
}) {
  const [chapter, setChapter] = useState<chapterType>();
  const maps: mapType[] = useAppSelector((state) => state.maps.maps);

  const { colorMode } = useColorMode();
  const dispatch = useAppDispatch();
  const storeStage = useAppSelector((state) => state.stage.stage);

  const [nodes, setNodes] = useState<Node[]>();
  const [edges, setEdges] = useState<Edge[]>();

  const [editableStage, setEditableStage] = useState<stageType>();

  const [isOpenCreateTransfer, setIsOpenCreateTransfer] =
    useState<boolean>(false);

  const [showModalEditTransfer, setShowModalEditTransfer] =
    useState<boolean>(false);
  const [showModalEditTransition, setShowModalEditTransition] =
    useState<boolean>(false);

  // для dnd
  const reactFlowWrapper: any = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const storeRedux: Store<RootState> = useStore();

  // вытаскивание карт
  useEffect(() => {
    store.each((key, value) => {
      if (key.includes(`story_${path[0]}_map`) && maps) {
        dispatch(setMaps(value));
      }
      if (key === "stopLoop") return false;
    });
  }, [isReady]);

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
    (direction: "TB" | "LB") => {
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(nodes as any[], edges as any[], direction);

      const copyChapter = store.get(`story_${path[0]}_chapter_${path[1]}`);
      const points = Object.values(copyChapter?.points!).flat() as pointType[];
      layoutedNodes.map((node) => {
        const stage = copyChapter.stages.find(
          (stage: stageType) => stage.id === +node.id
        );
        const point = points.find((point) => point.id === node.id);
        if (stage) {
          if (+stage.id !== +node.id) {
            console.log(stage.id, node.id);
          }
          stage.editor = {
            x: node.position.x,
            y: node.position.y,
          };
        }
        if (point) {
          point.editor = {
            x: node.position.x,
            y: node.position.y,
          };
        }
      });

      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
      updateChapter(copyChapter, true);
    },
    [nodes, edges]
  );

  // set id for points
  useEffect(() => {
    if (
      path[0] &&
      store.get(`story_${path[0]}_chapter_${path[1]}`) &&
      chapter?.points
    ) {
      const chapter =
        path[0] && store.get(`story_${path[0]}_chapter_${path[1]}`);

      const points = chapter?.points;
      // @ts-ignore
      const pointsValues: any = Object.values(points);

      pointsValues.map((pointsGroup: any) => {
        pointsGroup.forEach((item: any) => {
          if (!item.id) {
            item.id = uuidv4();
          }
        });
      });
      const updatedChapter = {
        ...chapter,
        points,
      };
      updateChapter(updatedChapter, true);
    }
  }, [isReady]);

  // отрисовка nodes и edges
  useEffect(() => {
    const initialNodes: any[] = [];
    const initialEdges: any[] = [];

    chapter?.stages?.map((stage: stageType) => {
      initialNodes.push({
        id: String(stage.id),
        type: "nodeStage",
        selected: stage.id === storeStage?.id,
        data: {
          label: stageName(stage.type_stage)
            ? stageName(stage.type_stage)
            : stage.title,
          onClick: () => {
            dispatch(setStageToRedux(null));
            dispatch(setTransition(null));
            setEditableStage(undefined);
            setTimeout(() => {
              dispatch(setStageToRedux(stage));
              setEditableStage(stage);
            }, 0);
          },
          text: stage.texts && stage.texts[0].text,
          id: stage.id,
          actions: stage.actions || {},
        },
        position: stage.editor
          ? { x: stage.editor.x, y: stage.editor.y }
          : { x: 0, y: 0 },
      });
    });

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

    // отрисовка точек
    if (chapter?.points) {
      Object.entries(chapter?.points).map((points) => {
        points[1].map((point) => {
          const stage = {
            id: point.id,
            mapId: points[0],
            type_stage: 777,
            originalPoint: { point, mapId: points[0] },
            point: {
              id: point.id,
              ...point,
            },
          };
          initialNodes.push({
            id: String(point.id),
            type: "nodeStage",
            selected: false,
            data: {
              label: "Переход с карты",
              onClick: () => {
                dispatch(setTransition(null));
                dispatch(setStageToRedux(null));
                setEditableStage(undefined);
                setTimeout(() => {
                  dispatch(setTransition(stage));
                  setEditableStage(stage as unknown as stageType);
                }, 0);
              },
              id: point.id,
              actions: {},
            },
            position: point.editor
              ? { x: point.editor.x, y: point.editor.y }
              : { x: 0, y: 0 },
          });
          if (point.data.stage !== "") {
            initialEdges.push({
              id: `${point.id}-${point.data.stage}`,
              source: String(point.id),
              target: String(point.data.stage),
              type: "custom",
              data: {
                onClick: () => {},
              },
              markerEnd: {
                type: MarkerType.ArrowClosed,
              },
            });
          }
        });
      });
    }

    if (initialNodes.length !== 0) setNodes(initialNodes);
    if (initialEdges.length !== 0) setEdges(initialEdges);
  }, [chapter]);

  // передвижение node
  const onNodesChange = useCallback(
    (changes: any): void => {
      setNodes((nds: any) => applyNodeChanges(changes, nds));

      if (changes[0].position) {
        if (uuidValidate(changes[0].id)) {
          // @ts-ignore
          const points = JSON.parse(JSON.stringify(chapter?.points));
          const pointsValues: pointType[][] = Object.values(points);
          pointsValues.map((points) => {
            points.forEach((point) => {
              if (point.id === changes[0].id) {
                point.editor = {
                  x: changes[0].position.x,
                  y: changes[0].position.y,
                };
              }
            });
          });
          const updatedChapter = {
            ...chapter,
            points,
          };
          updateChapter(updatedChapter, false);
        } else {
          const idStage = chapter?.stages?.indexOf(
            chapter?.stages?.filter((stage) => +stage.id === +changes[0].id)[0]
          ) as number;
          const updatedStageWithPosition = {
            ...chapter?.stages[idStage],
            editor: {
              x: changes[0].position.x,
              y: changes[0].position.y,
            },
          };

          const initialChapter =
            path[0] && store.get(`story_${path[0]}_chapter_${path[1]}`);

          initialChapter.stages?.splice(idStage, 1, updatedStageWithPosition);

          updateChapter(initialChapter, false);
        }
      }
    },
    [chapter]
  );

  // нажатие на edge
  const onEdgesClick = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      const chapterFromLocalStorage =
        path[0] && store.get(`story_${path[0]}_chapter_${path[1]}`);

      if (uuidValidate(edge.source)) {
        const points = JSON.parse(
          JSON.stringify(chapterFromLocalStorage?.points)
        );
        const pointsValues: pointType[] = Object.values(
          points
        ).flat() as pointType[];
        const targetPoint = pointsValues.find(
          (point) => point.id === edge.source
        );
        const targetStage = chapterFromLocalStorage?.stages?.find(
          (stage: stageType) => {
            return +stage.id === +edge.target;
          }
        );
        dispatch(setTransitionToStore({ point: targetPoint, targetStage }));
        setShowModalEditTransition(true);
      } else {
        const stage = chapterFromLocalStorage.stages.find(
          (stage: stageType) => +stage.id === +edge.source
        );

        const targetTransfer = stage?.transfers?.find(
          (transfer: stageTransfer) => +transfer.stage === +edge.target
        );

        const indexTargetTransfer = stage?.transfers?.indexOf(targetTransfer);
        setShowModalEditTransfer(true);
        dispatch(setTargetTransfer({ targetTransfer, indexTargetTransfer }));
        dispatch(setStageToRedux({ ...stage }));
      }
    },
    [chapter]
  );

  const updateTransitionFromMap = () => {
    const chapterFromLocalStorage =
      path[0] && store.get(`story_${path[0]}_chapter_${path[1]}`);

    const transitionFromMap = storeRedux.getState().stage.transitionFromMap;
    if (!chapterFromLocalStorage.points[transitionFromMap.mapId]) {
      chapterFromLocalStorage.points[transitionFromMap.mapId] = [];
    }
    const transitionFromMapIndex = chapterFromLocalStorage.points[
      transitionFromMap.mapId
    ].indexOf(transitionFromMap.originalPoint);
    chapterFromLocalStorage.points[transitionFromMap.mapId].splice(
      transitionFromMapIndex,
      1,
      transitionFromMap.point
    );
    console.log(chapterFromLocalStorage);
    if (transitionFromMap.mapId !== transitionFromMap.originalPoint.mapId) {
      const transitionIndex = chapterFromLocalStorage.points[
        transitionFromMap.originalPoint.mapId
      ].indexOf(
        chapterFromLocalStorage.points[
          transitionFromMap.originalPoint.mapId
        ].find(
          (point: pointType) => point.id === transitionFromMap.originalPoint.id
        )
      );
      chapterFromLocalStorage.points[
        transitionFromMap.originalPoint.mapId
      ].splice(transitionIndex, 1);
    }
    console.log(chapterFromLocalStorage);

    updateChapter(chapterFromLocalStorage, true);
  };

  // Обновление стадии
  const updateStage = (stageId: number): void => {
    const chapterFromLocalStorage =
      path[0] && store.get(`story_${path[0]}_chapter_${path[1]}`);

    const stageIndex = chapterFromLocalStorage.stages.indexOf(
      chapterFromLocalStorage.stages.find(
        (stage: stageType) => stage.id === stageId
      )
    );

    const updatedStageWithUpdatedPosition = {
      ...storeStage,
      editor: {
        x:
          chapterFromLocalStorage.stages?.find(
            (stage: stageType) => +stage.id === +stageId
          ).editor.x || 0,
        y:
          chapterFromLocalStorage.stages?.find(
            (stage: stageType) => +stage.id === +stageId
          ).editor.y || 0,
      },
    };

    chapterFromLocalStorage.stages.splice(
      stageIndex,
      1,
      updatedStageWithUpdatedPosition
    );

    updateChapter(chapterFromLocalStorage, true);
  };

  const onConnect = useCallback(
    (connection: any): void => {
      const chapterFromLocalStorage =
        path[0] && store.get(`story_${path[0]}_chapter_${path[1]}`);

      if (uuidValidate(connection.source)) {
        const points = JSON.parse(
          JSON.stringify(chapterFromLocalStorage?.points)
        );
        const pointsValues: pointType[] = Object.values(
          points
        ).flat() as pointType[];
        const targetPoint = pointsValues.find(
          (point) => point.id === connection.source
        );
        targetPoint!.data = {
          stage: String(connection.target),
          chapter: String(path[1]),
        };
        updateChapter(
          {
            ...chapterFromLocalStorage,
            points,
          },
          true
        );
      } else {
        dispatch(
          setConnection({
            source: connection.source,
            target: connection.target,
          })
        );

        const stageIndex = chapterFromLocalStorage.stages.indexOf(
          chapterFromLocalStorage.stages.find(
            (stage: stageType) => +stage.id === +connection.source
          )
        );

        const targetTransfer = chapterFromLocalStorage?.stages[
          stageIndex
        ]?.transfers.find(
          (transfer: stageTransfer) => transfer.stage === connection.target
        );

        setIsOpenCreateTransfer(true);

        dispatch(setTargetTransfer(targetTransfer));
        dispatch(setStageToRedux(chapterFromLocalStorage?.stages[stageIndex]));
      }
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
    dispatch(setStageToRedux(null));
    setEditableStage(undefined);
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

  const onDragStart = (event: any, nodeType: any) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = useCallback((event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event?.dataTransfer?.getData("application/reactflow");

      if (typeof type === "undefined" || !type) {
        return;
      }

      const chapterFromLocalStorage =
        path[0] && store.get(`story_${path[0]}_chapter_${path[1]}`);

      const idLastStage = Math.max(
        ...chapterFromLocalStorage?.stages.map((stage: stageType) => stage.id)
      );

      // @ts-ignore
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      if (type === "transition") {
        const newPoint = {
          id: uuidv4(),
          type: 0,
          name: "Переход с карты",
          pos: "500:500",
          data: {
            chapter: String(chapter?.id),
            stage: "",
          },
          condition: {},
          editor: {
            ...position,
          },
        };
        if (!chapterFromLocalStorage.points) {
          chapterFromLocalStorage.points = {
            "0": [],
          };
        }
        const updatedChapter = {
          ...chapterFromLocalStorage,
          points: {
            ...chapterFromLocalStorage.points,
            "0": [...chapterFromLocalStorage.points["0"], newPoint],
          },
        };
        updateChapter(updatedChapter, true);
      } else {
        const updatedChapter = {
          ...chapterFromLocalStorage,
          stages: [
            ...chapterFromLocalStorage?.stages,
            newStage(
              type as "default" | "exit",
              idLastStage + 1,
              true,
              position
            ),
          ],
        };
        updateChapter(updatedChapter, true);
      }
    },
    [chapter, reactFlowInstance]
  );

  useEffect(() => {
    if (query.stage) {
      dispatch(setStageToRedux(null));
      setEditableStage(undefined);

      const chapterFromLocalStorage =
        path[0] && store.get(`story_${path[0]}_chapter_${path[1]}`);

      const stage = chapterFromLocalStorage.stages.find((stage: stageType) => {
        if (query.stage) {
          return stage.id === +query.stage;
        }
      });
      setTimeout(() => {
        dispatch(setStageToRedux(stage));
        setEditableStage(stage);
      }, 0);
    }
  }, [isReady]);

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
        _dark={{
          borderBottom: "1px solid #171923",
        }}
      >
        <CreateStage onDragStart={onDragStart} />
        <Text>Глава {chapter?.id}</Text>
        <Spacer />
        {chapter && (
          <ToStage setEditableStage={setEditableStage} chapter={chapter} />
        )}
        <Button
          onClick={() => {
            onLayout("TB");
          }}
          fontWeight="normal"
          borderRadius={0}
        >
          Сортировка
        </Button>
        <Checkbox onChange={() => setShowFps(!showFps)} mr={1}>
          Счётчик ФПС
        </Checkbox>
      </Box>
      <Box h="calc(100vh - 83px)">
        {/* Штука для редактирования стадий */}
        <EditStagePopover
          editableStage={editableStage}
          updateStage={updateStage}
          deleteStage={deleteStage}
          setEditableStage={setEditableStage}
          updateTransitionFromMap={updateTransitionFromMap}
        />
        <Box ref={reactFlowWrapper} height="100%">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgeClick={onEdgesClick}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onDrop={onDrop as () => void}
            onDragOver={onDragOver}
            onInit={setReactFlowInstance}
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
            />
          </ReactFlow>
        </Box>

        <CreateTransferModal
          setIsOpenCreateTransfer={setIsOpenCreateTransfer}
          updateStage={updateStage}
          isOpenCreateTransfer={isOpenCreateTransfer}
        />

        <EditTransferModal
          setShowModalEditTransfer={setShowModalEditTransfer}
          showModalEditTransfer={showModalEditTransfer}
          updateStage={updateStage}
        />
        <EditTransitionModal
          setShowModalEditTransition={setShowModalEditTransition}
          showModalEditTransition={showModalEditTransition}
        />
      </Box>
    </>
  );
}