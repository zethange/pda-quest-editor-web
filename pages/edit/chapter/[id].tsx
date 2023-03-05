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
import { Button, Form, Modal } from "react-bootstrap";
import {
  editTextInStore,
  editTransferInStore,
  newTransferToStore,
  setStageToStore,
  storeStage,
} from "@/store/store";

import { newStage } from "@/store/types";
import "reactflow/dist/style.css";
import NavBar from "@/components/UI/NavBar";
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
  const [showPopoverStage, setShowPopoverStage] = useState<boolean>(false); // для создания стадии

  const [connectionInfo, setConnectionInfo] = useState<any>();

  // Вытаскивание главы из localStorage
  useEffect(() => {
    const chapterFromLocalStorage = JSON.parse(
      localStorage.getItem(`chapter_${id}`) as any
    );

    setChapter(chapterFromLocalStorage);
  }, [isReady]);

  // Функция обновления главы
  const updateChapter = async (chapter: any, all: boolean) => {
    if (all) await setChapter(chapter);
    await localStorage.setItem(`chapter_${id}`, JSON.stringify(chapter));
    return true;
  };

  // Первоначальная отрисовка нод и переходов
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
                  setStageToStore(stage);
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
  const updateStage = (stageId: number, setOpenStageEnabled: boolean) => {
    const chapterFromLocalStorage = JSON.parse(
      localStorage.getItem(`chapter_${id}`) as any
    );

    chapterFromLocalStorage.stages.splice(stageId, 1, storeStage);

    updateChapter(chapterFromLocalStorage, true);
    setOpenStageEnabled && setOpenStage(storeStage);
  };

  const onEdgesChange = useCallback((changes: any) => {}, [setEdges, chapter]);

  const onConnect = useCallback(
    (connection: any) => {
      const chapterFromLocalStorage = JSON.parse(
        localStorage.getItem(`chapter_${id}`) as any
      );

      setConnectionInfo({
        source: connection.source,
        target: connection.target,
      });

      const targetTransfer = chapterFromLocalStorage.stages[
        connection.source
      ].transfers.find(
        (transfer: any) => transfer.stage_id === connection.target
      );

      setStageToStore({
        ...chapterFromLocalStorage.stages[connection.source],
        targetTransfer,
      });
    },
    [setEdges]
  );

  function deleteStage(id: number) {
    const chapterFromLocalStorage = JSON.parse(
      localStorage.getItem(`chapter_${id}`) as any
    );

    const indexStage = chapterFromLocalStorage?.stages?.indexOf(
      chapterFromLocalStorage?.stages?.find((stage: any) => stage.id === id)
    );

    chapterFromLocalStorage?.stages?.splice(indexStage, 1);

    chapterFromLocalStorage && updateChapter(chapterFromLocalStorage, true);
    setOpenStage(null);
    setStageToStore(null);
    setEditableStage(false);
  }

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
                  onClick={() => deleteStage(openStage?.id)}
                >
                  Удалить
                </button>
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
                    setStageToStore(null);
                  }}
                >
                  Закрыть
                </button>
              </div>
              {editableStage ? (
                <div>
                  <div className="stage-card">
                    <b>Тексты:</b>
                    {storeStage.texts.map(
                      (text: any, index: number) =>
                        text.text && (
                          <Form.Control
                            as="textarea"
                            defaultValue={text.text}
                            onChange={(event) =>
                              editTextInStore(index, {
                                text: event.target.value,
                                condition: text.condition,
                              })
                            }
                          />
                        )
                    )}
                  </div>
                  <div className="stage-card">
                    <b>Тексты:</b>
                    {storeStage.transfers.map(
                      (transfer: any, index: number) =>
                        transfer.text && (
                          <Form.Control
                            as="textarea"
                            defaultValue={transfer.text}
                            onChange={(event) =>
                              editTransferInStore(index, {
                                text: event.target.value,
                                stage_id: transfer.stage_id,
                                condition: transfer.condition,
                              })
                            }
                          />
                        )
                    )}
                  </div>
                  <button
                    onClick={() => {
                      updateStage(storeStage.id, true);
                      setEditableStage(false);
                      setOpenStage(null);
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
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
          >
            <MiniMap zoomable pannable />
            <Controls />
            <Background />
          </ReactFlow>
        </div>
        <Modal
          show={connectionInfo}
          onHide={() => setConnectionInfo(null)}
          backdrop="static"
          keyboard={false}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              Создание перехода со стадии {connectionInfo?.source} на{" "}
              {connectionInfo?.target}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <textarea
                style={{ border: "2px solid #242424", width: "470px" }}
                placeholder="Введите текст..."
                defaultValue={connectionInfo?.targetTransfer?.text}
                onChange={(event) => {
                  newTransferToStore({
                    text: event.target.value,
                    stage_id: connectionInfo?.target,
                    condition: {},
                  });
                }}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                updateStage(storeStage.id, false);
                setConnectionInfo(null);
              }}
            >
              Сохранить
            </Button>
            <Button variant="secondary" onClick={() => setConnectionInfo(null)}>
              Закрыть
            </Button>
          </Modal.Footer>
        </Modal>
      </main>
    </>
  );
}
