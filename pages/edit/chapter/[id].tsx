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
  const [editableTransfer, setEditableTransfer] = useState<boolean>(false);
  const [showPopoverStage, setShowPopoverStage] = useState<boolean>(false);

  const [sourceStage, setSourceStage] = useState<any>();
  const [showSourceStage, setShowSourceStage] = useState<boolean>(false);

  // Функция обновления главы
  const updateChapter = async (chapter: any, all: boolean) => {
    if (all) {
      await setChapter(chapter);
    }
    await localStorage.setItem(`chapter_${id}`, JSON.stringify(chapter));
    return true;
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
                  setStageToStore(stage);
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
  const updateStage = (stageId: number, setOpenStageEnabled: boolean) => {
    const chapterFromLocalStorage = JSON.parse(
      localStorage.getItem(`chapter_${id}`) as any
    );

    chapterFromLocalStorage.stages.splice(stageId, 1, storeStage);

    updateChapter(chapterFromLocalStorage, true);
    setOpenStageEnabled && setOpenStage(storeStage);
  };

  const onEdgesChange = useCallback(
    (changes: any) => {
      changes.map((change: any) => {
        if (change.selected) {
          const idSelectedStage = change.id.split("-")[0];
          const idThereStage = change.id.split("-")[1];
          const sourceStage = chapter.stages[idSelectedStage];

          let thereTransfer = sourceStage.transfers.find(
            (transfer: any) => transfer.stage_id === idThereStage
          );

          const transferIndex = sourceStage.transfers.indexOf(thereTransfer);

          setSourceStage({
            ...sourceStage,
            idThereStage,
            thereTransfer,
            transferIndex,
          });
          setShowSourceStage(true);
          setStageToStore(sourceStage);
        }
      });
    },
    [setEdges, chapter]
  );

  const onConnect = useCallback(
    (connection: any) => {
      console.log(connection);
    },
    [setEdges]
  );

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
                  <button
                    onClick={() => {
                      updateStage(storeStage.id, true);
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
          show={showSourceStage}
          onHide={() => {
            setShowSourceStage(false);
            setEditableTransfer(false);
          }}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Переход со стадии {sourceStage?.id} на {sourceStage?.idThereStage}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {(!editableTransfer && (
              <>
                <p>Текст: {sourceStage?.thereTransfer?.text}</p>
                Условия: {JSON.stringify(sourceStage?.thereTransfer?.condition)}
              </>
            )) || (
              <div>
                <textarea
                  style={{
                    border: "2px solid #000",
                    width: "765px",
                  }}
                  defaultValue={sourceStage?.thereTransfer?.text}
                  onChange={(event) => {
                    editTransferInStore(sourceStage?.transferIndex, {
                      text: event.target.value,
                      stage_id: sourceStage?.thereTransfer?.stage_id,
                      condition: sourceStage?.thereTransfer?.condition,
                    });
                  }}
                />
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            {(!editableTransfer && (
              <Button onClick={() => setEditableTransfer(true)}>
                Редактировать
              </Button>
            )) || (
              <Button
                onClick={() => {
                  setShowSourceStage(false);
                  setEditableTransfer(false);
                  updateStage(sourceStage?.id, false);
                }}
              >
                Сохранить
              </Button>
            )}
            <Button
              onClick={() => {
                setShowSourceStage(false);
                setEditableTransfer(false);
              }}
            >
              Закрыть
            </Button>
          </Modal.Footer>
        </Modal>
      </main>
    </>
  );
}
