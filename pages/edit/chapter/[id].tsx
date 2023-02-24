import Head from "next/head";
import NavBar from "@/components/UI/NavBar";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import "reactflow/dist/style.css";
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  MiniMap,
  SelectionMode,
} from "reactflow";
import { stageType } from "@/store/types";
import ChangeThemeButton from "@/components/UI/ChangeThemeButton";

export default function ChapterEditById() {
  const { query, isReady } = useRouter();
  const id = query.id as string;
  const [chapter, setChapter] = useState<any>();

  const [nodes, setNodes] = useState<any[]>();
  const [edges, setEdges] = useState<any[]>();

  useEffect(() => {
    const chapterFromLocalStorage = JSON.parse(
      localStorage.getItem(`chapter_${id}`) as any
    );
    setChapter(chapterFromLocalStorage);

    const initialNodes: any[] = [];
    const initialEdges: any[] = [{ id: "0-1", source: "0", target: "1" }];

    chapterFromLocalStorage?.stages.map((stage: stageType) => {
      if (stage.texts) {
        var stageTransfersText = stage?.texts[0]?.text;
      }

      initialNodes.push({
        id: String(stage.id),
        data: {
          label: `${stage.title}`,
        },
        position: { x: Math.random() * 1000, y: Math.random() * 1000 },
      });
    });

    chapterFromLocalStorage?.stages.map((stage: stageType) => {
      let stageTransfersId = stage.transfers
        ? stage.transfers[0].stage_id
        : false;
      let stageTransfersText = stage.texts ? stage.texts[0].text : false;

      initialEdges.push({
        id: `${stage.id}-${stageTransfersId}`,
        label: String(stageTransfersText),
        source: String(stage.id),
        target: String(stageTransfersId),
      });
      console.log(stage.transfers);
    });

    if (initialNodes.length !== 0) {
      setNodes(initialNodes);
    }

    if (initialEdges.length !== 0) {
      setEdges(initialEdges);
      console.log(initialEdges);
    }
  }, [isReady]);

  const onNodesChange = useCallback(
    // @ts-ignore
    (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const panOnDrag = [1, 2];

  return (
    <>
      <Head>
        <title>Редактирование главы {chapter?.id}</title>
        <meta name="description" content="Редактор главы" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
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
          <button className="navbar__header">Помощь</button>
        </NavBar>
        <hr />
        <NavBar>
          <button className="navbar__header">Создать стадию</button>
        </NavBar>
        <div className="stage-body">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            fitView
          >
            <MiniMap />
            <Controls />
            <Background />
          </ReactFlow>
        </div>
      </main>
    </>
  );
}
