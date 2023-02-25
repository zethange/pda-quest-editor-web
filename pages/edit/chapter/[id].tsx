import Head from "next/head";
import NavBar from "@/components/UI/NavBar";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import "reactflow/dist/style.css";
import ReactFlow, {
  applyNodeChanges,
  Background,
  Controls,
  MarkerType,
  MiniMap,
} from "reactflow";
import { newStage } from "@/store/types";
import ChangeThemeButton from "@/components/UI/ChangeThemeButton";
import ShowPopover from "@/components/ShowPopover";

export default function ChapterEditById() {
  const { query, isReady } = useRouter();
  const id = query.id as string;

  const [chapter, setChapter] = useState<any>();

  const [nodes, setNodes] = useState<any[]>();
  const [edges, setEdges] = useState<any[]>();

  const [openStage, setOpenStage] = useState<any>();
  const [showPopoverStage, setShowPopoverStage] = useState<boolean>(false);

  const updateChapter = (chapter: any) => {
    setChapter(chapter);
    localStorage.setItem(`chapter_${id}`, JSON.stringify(chapter));
    console.log("Обновление главы: ", chapter);
  };

  useEffect(() => {
    const chapterFromLocalStorage = JSON.parse(
      localStorage.getItem(`chapter_${id}`) as any
    );
    setChapter(chapterFromLocalStorage);
  }, [isReady]);

  useEffect(() => {
    const initialNodes: any[] = [];
    const initialEdges: any[] = [];

    chapter?.stages.map((stage: any) => {
      initialNodes.push({
        id: String(stage.id),
        data: {
          label: (
            <button onClick={() => setOpenStage(stage)}>
              {stage.title ? stage.title : "Переход на карту"}
            </button>
          ),
        },
        position: { x: Math.random() * 1000, y: Math.random() * 1000 },
      });
    });

    chapter?.stages.map((stage: any) => {
      let stageTransfersId = stage.transfers
        ? stage.transfers[0].stage_id
        : false;

      initialEdges.push({
        id: `${stage.id}-${stageTransfersId}`,
        source: String(stage.id),
        target: String(stageTransfersId),
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
      });
    });

    if (initialNodes.length !== 0) {
      setNodes(initialNodes);
    }

    if (initialEdges.length !== 0) {
      setEdges(initialEdges);
    }
  }, [chapter]);

  const onNodesChange = useCallback(
    // @ts-ignore
    (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const createStage = (type: string) => {
    const updatedChapter = {
      id: chapter.id,
      stages: [...chapter.stages, newStage(type, chapter.stages.length)],
    };
    updateChapter(updatedChapter);
  };

  return (
    <>
      <Head>
        <title>Редактирование главы {chapter?.id} :: PDA Quest Editor</title>
        <meta name="description" content="Редактор главы" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="https://artux.net/favicon-32x32.png" />
      </Head>
      <main className="main">
        <NavBar>
          <Link className="navbar__header" href="/">
            Назад
          </Link>
          <button className="navbar__header navbar__header--active">
            Глава
          </button>
          <button className="navbar__header">Карта</button>
          <button className="mx-auto"></button>
          <ChangeThemeButton />
          <Link className="navbar__header" href="/edit/chapter/help">
            Помощь
          </Link>
        </NavBar>
        <hr />
        <NavBar>
          <div
            className="navbar__header no-select"
            onClick={() => setShowPopoverStage(!showPopoverStage)}
          >
            Создать стадию
            {showPopoverStage && (
              <div className="stage-popover">
                <button
                  className="button-popover"
                  onClick={() => createStage("default")}
                >
                  Диалог
                </button>
                <button
                  className="button-popover"
                  onClick={() => createStage("exit")}
                >
                  Выход на карту
                </button>
              </div>
            )}
          </div>
        </NavBar>
        <div className="stage-body">
          {openStage && <ShowPopover stage={openStage} />}
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            fitView
          >
            <MiniMap zoomable pannable />
            <Controls />
            <Background />
          </ReactFlow>
        </div>
      </main>
    </>
  );
}
