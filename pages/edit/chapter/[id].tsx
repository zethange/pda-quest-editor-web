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
} from "reactflow";
import { stageType } from "@/store/types";
import ChangeThemeButton from "@/components/UI/ChangeThemeButton";

export default function ChapterEditById() {
  const { query, isReady } = useRouter();
  const id = query.id as string;
  const [chapter, setChapter] = useState<any>();

  const [nodes, setNodes] = useState<any[]>();

  useEffect(() => {
    const chapterFromLocalStorage = JSON.parse(
      localStorage.getItem(`chapter_${id}`) as any
    );
    setChapter(chapterFromLocalStorage);

    const initialNodes: any[] = [];

    chapterFromLocalStorage?.stages.map((stage: stageType) => {
      initialNodes.push({
        id: String(stage.id),
        data: { label: `Стадия ${stage.id}` },
        position: { x: 0, y: 0 },
      });
    });

    console.log(initialNodes);
    if (initialNodes.length !== 0) {
      setNodes(initialNodes);
    }
  }, [isReady]);

  const onNodesChange = useCallback(
    // @ts-ignore
    (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

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
          <ReactFlow nodes={nodes} onNodesChange={onNodesChange} fitView>
            <MiniMap />
            <Controls />
            <Background />
          </ReactFlow>
        </div>
      </main>
    </>
  );
}
