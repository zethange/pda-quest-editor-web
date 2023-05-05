import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
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
  Spacer,
  Text,
  useColorMode,
} from "@chakra-ui/react";

import "reactflow/dist/style.css";

import { newStage } from "@/store/createTools";
import CustomHead from "@/components/Global/CustomHead";
import { NodeStage } from "@/components/Global/StageNode";
import { chapterType, stageTransfer, stageType } from "@/store/types/types";
import Stats from "stats.js";
import TransferEdge from "@/components/Global/TransferEdge";
import { stageName } from "@/store/utils/stageName";
import ToStage from "@/components/Chapter/ToStage";
import CreateStage from "@/components/Chapter/CreateStage";
import CreateTransferModal from "@/components/Chapter/EditStage/CreateTransferModal";
import EditTransferModal from "@/components/Chapter/EditStage/EditTransferModal";
import EditStagePopover from "@/components/Chapter/EditStage/EditStagePopover";
import { useDispatch, useSelector } from "react-redux";
import {
  setConnection,
  setStageToStore as setStageToRedux,
} from "@/store/reduxStore/stageSlice";

export default function StageEditScreenChakra({
  path,
  isReady,
  query,
}: {
  path: string[];
  query: any;
  isReady: boolean;
}) {
  const [chapter, setChapter] = useState<chapterType | any>();
  const { colorMode } = useColorMode();
  const dispatch = useDispatch();
  const storeStage = useSelector((state: any) => state.stage.stage);

  const [nodes, setNodes] = useState<any[]>();
  const [edges, setEdges] = useState<any[]>();

  const [editableStage, setEditableStage] = useState<stageType | any>();

  const [isOpenCreateTransfer, setIsOpenCreateTransfer] =
    useState<boolean>(false);

  const [showModalEditTransfer, setShowModalEditTransfer] =
    useState<boolean>(false);

  const [transferIndex, setTransferIndex] = useState<string>("");
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

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
        if (stage) {
          if (+stage.id !== +node.id) {
            console.log(stage.id, node.id);
          }
          stage.editor = {
            x: node.position.x,
            y: node.position.y,
          };
        }
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

    chapter?.stages?.map((stage: stageType) => {
      initialNodes.push({
        id: String(stage.id),
        type: "nodeStage",
        selected: stage.id === storeStage.id,
        data: {
          label: stageName(stage.type_stage)
            ? stageName(stage.type_stage)
            : stage.title,
          onClick: () => {
            dispatch(setStageToRedux(null));
            setEditableStage(null);
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

        updateChapter(
          {
            id: chapter.id,
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
      setShowModalEditTransfer(true);
      dispatch(
        setStageToRedux({ ...stage, targetTransfer, indexTargetTransfer })
      );
    },
    [chapter]
  );

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

      dispatch(
        setConnection({ source: connection.source, target: connection.target })
      );

      const targetTransfer = chapterFromLocalStorage?.stages[
        connection.source
      ].transfers.find((transfer: any) => transfer.stage === connection.target);

      setIsOpenCreateTransfer(true);

      dispatch(
        setStageToRedux({
          ...chapterFromLocalStorage?.stages[connection.source],
          targetTransfer,
        })
      );
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

  const onDragStart = (event: any, nodeType: any) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = useCallback((event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: any) => {
      event.preventDefault();

      // @ts-ignore
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");

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
      const updatedChapter = {
        id: chapterFromLocalStorage?.id,
        stages: [
          ...chapterFromLocalStorage?.stages,
          newStage(type, idLastStage + 1, true, position),
        ],
      };
      updateChapter(updatedChapter, true);
    },
    [chapter, reactFlowInstance]
  );

  useEffect(() => {
    if (query.stage) {
      dispatch(setStageToRedux(null));
      setEditableStage(null);

      const chapterFromLocalStorage =
        path[0] && store.get(`story_${path[0]}_chapter_${path[1]}`);

      const stage = chapterFromLocalStorage.stages.find(
        (stage: stageType) => stage.id === +query.stage
      );
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
        <ToStage setEditableStage={setEditableStage} chapter={chapter} />
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
        />
        <Box ref={reactFlowWrapper} height="100%">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgeClick={onEdgesClick}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onDrop={onDrop}
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
          setTransferIndex={setTransferIndex}
          updateStage={updateStage}
          isOpenCreateTransfer={isOpenCreateTransfer}
        />

        <EditTransferModal
          setShowModalEditTransfer={setShowModalEditTransfer}
          showModalEditTransfer={showModalEditTransfer}
          updateStage={updateStage}
        />
      </Box>
    </>
  );
}
