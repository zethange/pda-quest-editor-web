import CustomHead from "@/components/Global/CustomHead";
import ChangeThemeButton from "@/components/UI/NavBar/ChangeThemeButton";
import { useChapterEditorStore } from "@/entities/chapter-editor";
import { ChapterType } from "@/shared/lib/type/chapter.type";
import { Box, Button, useColorMode } from "@chakra-ui/react";
import { MouseEvent, useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";

import ReactFlow, {
  Background,
  Controls,
  Edge,
  MiniMap,
  Node,
} from "reactflow";
import "reactflow/dist/style.css";

import { useStageStore } from "@/entities/stage-editor";
import { AddStageButton } from "@/features/chapter-editor";
import { StageEditor } from "@/features/stage-editor";
import { logger } from "@/shared/lib/logger";
import { StageNode } from "@/shared/ui";

const ChapterEditor = () => {
  const {
    setChapterId,
    setStoryId,
    chapter,
    setChapter,
    //
    nodes,
    edges,
    setNodes,
    setEdges,
    onEdgesChange,
    onNodesChange,

    setParameters,
  } = useChapterEditorStore();

  const { setStage, setPoint, reset } = useStageStore();
  const { storyId, chapterId } = useParams();
  const { colorMode } = useColorMode();

  useEffect(() => {
    setChapterId(+(chapterId as string));
    setStoryId(+(storyId as string));

    const chapter = JSON.parse(
      localStorage.getItem(`story_${storyId}_chapter_${chapterId}`) as string
    ) as ChapterType;

    setChapter(chapter);
  }, []);

  useEffect(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const parameters: string[] = [];

    chapter?.stages.forEach((stage) => {
      const title = stage.title || "Переход на карту";

      const node: Node = {
        id: "stage_" + String(stage.id),
        type: "stage",
        data: {
          label: title,
          text: stage.texts?.[0].text || "",
          stage,
        },
        position: {
          x: stage.editor?.x || 0,
          y: stage.editor?.y || 0,
        },
      };
      nodes.push(node);

      stage.transfers?.forEach((transfer) => {
        const edge: Edge = {
          id: `${node.id}->${"stage_" + transfer.stage}`,
          data: {
            label: transfer.text,
          },
          source: node.id,
          target: `stage_${transfer.stage}`,
        };
        edges.push(edge);
      });

      Object.entries(stage.actions || {}).forEach(([operator, values]) => {
        if (operator !== "add") return;

        values.forEach((value) => {
          if (parameters.includes(value)) return;
          parameters.push(value);
        });
      });
    });

    Object.entries(chapter?.points || {}).forEach(([key, points]) => {
      points.forEach((point) => {
        const node: Node = {
          id: "point_" + String(point.id),
          type: "stage",
          data: {
            label: `Переход с карты ${key}`,
            point,
            mapId: key,
          },
          position: {
            x: point.editor?.x || 0,
            y: point.editor?.y || 0,
          },
        };
        const edge: Edge = {
          id: `${node.id}->${"stage_" + point?.data.stage}`,
          data: {
            label: `Переход на карту ${point.mapId}`,
          },
          source: node.id,
          target: `stage_${point.data.stage}`,
        };

        nodes.push(node);
        edges.push(edge);
      });
    });
    setNodes(nodes);
    setEdges(edges);

    logger.info("Finded parameters:", parameters);
    // set parameters
    setParameters(parameters);
    localStorage.setItem(
      `story_${storyId}_chapter_${chapterId}`,
      JSON.stringify(chapter)
    );
  }, [chapter]);

  const onNodeDragStop = () => {
    nodes.forEach((node) => {
      const [type, id] = node.id.split("_");
      switch (type) {
        case "stage":
          const targetStage = chapter?.stages.find((stage) => stage.id === +id);
          if (!targetStage) break;

          targetStage!.editor = {
            x: node.position.x,
            y: node.position.y,
          };
          break;
        case "point":
          const map: `${number}` = node.data.mapId;
          const point = chapter?.points![map].find((point) => point.id === id);
          if (!point) break;

          point!.editor = { x: node.position.x, y: node.position.y };

          break;
      }
    });

    localStorage.setItem(
      `story_${storyId}_chapter_${chapterId}`,
      JSON.stringify(chapter)
    );

    setChapter(chapter as ChapterType);
  };

  const onNodeClick = (_: MouseEvent, node: Node) => {
    reset();

    setTimeout(() => {
      const [type, id] = node.id.split("_");
      switch (type) {
        case "stage":
          const targetStage = chapter?.stages.find((stage) => stage.id === +id);
          if (!targetStage) break;
          logger.info("Select stage:", targetStage);
          setStage(JSON.parse(JSON.stringify(targetStage)));

          break;
        case "point":
          const map: `${number}` = node.data.mapId;
          const point = chapter?.points![map].find((point) => point.id === id);
          if (!point) break;

          setPoint(JSON.parse(JSON.stringify(point)));
          break;
      }
    }, 0);
  };

  const nodeTypes = useMemo(() => ({ stage: StageNode }), []);

  return (
    <>
      <CustomHead title={`Редактирование главы ${chapterId}`} />
      <Box>
        <Box
          display="flex"
          justifyContent="space-between"
          borderBottomWidth="1px"
          gap={1}
          p={1}
        >
          <Box>
            <Link to={`/edit/story/${storyId}`}>
              <Button size="sm">Назад</Button>
            </Link>
          </Box>
          <Box>
            <ChangeThemeButton rounded={true} size="sm" />
          </Box>
        </Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          borderBottomWidth="1px"
          gap={1}
          p={1}
          h="40px"
        >
          <AddStageButton />
        </Box>

        <Box height="calc(100vh - 82px)" width="100vw" position="relative">
          <StageEditor />

          <ReactFlow
            nodeTypes={nodeTypes}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            onNodeDragStop={() => onNodeDragStop()}
            onSelectionDragStop={() => onNodeDragStop()}
            minZoom={0.2}
            fitView
          >
            <Background
              style={{
                background: colorMode == "light" ? "#fafafa" : "#171923",
              }}
            />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </Box>
      </Box>
    </>
  );
};

export default ChapterEditor;
