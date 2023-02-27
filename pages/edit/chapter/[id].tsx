import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import ReactFlow, {
  applyNodeChanges,
  Background,
  Controls,
  MarkerType,
  MiniMap,
} from "reactflow";
import Link from "next/link";
import Head from "next/head";
import NavBar from "@/components/UI/NavBar";
import "reactflow/dist/style.css";

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
  const [editableStage, setEditableStage] = useState<boolean>(false);
  const [showPopoverStage, setShowPopoverStage] = useState<boolean>(false);

  const [texts, setTexts] = useState<any>();
  const [transfers, setTransfers] = useState<any>();

  // Функция обновления главы
  const updateChapter = (chapter: any, all: boolean) => {
    if (all) {
      setChapter(chapter);
    }
    localStorage.setItem(`chapter_${id}`, JSON.stringify(chapter));
  };

  // Вытаскивание главы из localStorage
  useEffect(() => {
    const chapterFromLocalStorage = JSON.parse(
      localStorage.getItem(`chapter_${id}`) as any
    );

    setChapter(chapterFromLocalStorage);
  }, [isReady]);

  // Первоначальная отрисовка нод
  useEffect(() => {
    const initialNodes: any[] = [];
    const initialEdges: any[] = [];

    chapter?.stages.map((stage: any) => {
      initialNodes.push({
        id: String(stage.id),
        data: {
          label: (
            <>
              <button
                onClick={() => {
                  setOpenStage(stage);
                  setEditableStage(false);
                }}
              >
                {stage.title ? stage.title : "Переход на карту"}
              </button>
            </>
          ),
        },
        position: { x: stage.editor.x, y: stage.editor.y },
      });
    });

    chapter?.stages.map((stage: any) => {
      stage?.transfers?.map((transfer: any) => {
        initialEdges.push({
          id: `${stage.id}-${transfer.stage_id}`,
          source: String(stage.id),
          target: String(transfer.stage_id),
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
        });
      });
    });

    if (initialNodes.length !== 0) {
      setNodes(initialNodes);
    }

    if (initialEdges.length !== 0) {
      setEdges(initialEdges);
    }
  }, [chapter]);

  // При изменении нод
  const onNodesChange = useCallback(
    (changes: any) => {
      // @ts-ignore
      setNodes((nds) => applyNodeChanges(changes, nds));

      if (changes[0].position) {
        const updatedStageWithPosition = {
          ...chapter?.stages[changes[0].id],
          editor: {
            x: changes[0].position.x,
            y: changes[0].position.y,
          },
        };

        const idInitialStage = chapter?.stages.indexOf(
          chapter.stages[changes[0].id]
        );

        const initialStages = JSON.parse(
          localStorage.getItem(`chapter_${id}`) as any
        ).stages;
        initialStages?.splice(idInitialStage, 1, updatedStageWithPosition);

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

  // Создание стадии
  const createStage = (type: string) => {
    const chapterFromLocalStorage = JSON.parse(
      localStorage.getItem(`chapter_${id}`) as any
    );

    const updatedChapter = {
      id: chapterFromLocalStorage?.id,
      music: chapterFromLocalStorage?.music,
      stages: [
        ...chapterFromLocalStorage?.stages,
        newStage(type, chapterFromLocalStorage?.stages.length),
      ],
    };
    updateChapter(updatedChapter, true);
  };

  // Обновление стадии
  const updateStage = (stageId: number) => {
    const chapterFromLocalStorage = JSON.parse(
      localStorage.getItem(`chapter_${id}`) as any
    );

    const stage = {
      ...chapterFromLocalStorage.stages[stageId],
      texts,
      transfers,
    };

    chapterFromLocalStorage.stages.splice(stageId, 1, stage);

    if (texts || transfers) {
      updateChapter(chapterFromLocalStorage, true);
      setOpenStage(stage);
    }

    setTexts(null);
    setTransfers(null);
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
          {openStage && (
            <div className="editor-popover">
              <div className="stage-popover__header">
                Стадия {openStage?.id}
                <div className="mx-auto"></div>
                <button
                  style={{ fontSize: "12px", paddingRight: "5px" }}
                  onClick={() => setEditableStage(!editableStage)}
                >
                  {editableStage ? "Просмотр" : "Редактировать"}
                </button>
                <button
                  style={{ fontSize: "12px" }}
                  onClick={() => {
                    setOpenStage(null);
                    setEditableStage(false);
                  }}
                >
                  Закрыть
                </button>
              </div>
              {editableStage ? (
                <div>
                  <div className="stage-card">
                    <b>Тексты:</b>
                    <textarea
                      name="text"
                      id="text"
                      style={{ width: "340px", resize: "vertical" }}
                      defaultValue={openStage.texts[0].text}
                      onChange={(event) =>
                        setTexts([
                          {
                            text: event.target.value,
                            conditions: openStage.texts[0].condition,
                          },
                        ])
                      }
                    ></textarea>
                  </div>
                  <div className="stage-card">
                    <b>Ответы:</b>
                    <textarea
                      name="text"
                      id="text"
                      style={{ width: "340px", resize: "vertical" }}
                      defaultValue={openStage.transfers[0].text}
                      onChange={(event) =>
                        setTransfers([
                          {
                            text: event.target.value,
                            stage_id: openStage.transfers[0].stage_id,
                            conditions: openStage.transfers[0].condition,
                          },
                        ])
                      }
                    ></textarea>
                  </div>
                  <button
                    onClick={() => {
                      updateStage(openStage.id);
                      setEditableStage(false);
                    }}
                  >
                    Сохранить
                  </button>
                </div>
              ) : (
                <ShowPopover stage={openStage} />
              )}
            </div>
          )}
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
