import React, { useEffect, useState, useCallback, useMemo } from "react";
import store from "store2";

import { useRouter } from "next/router";
import ReactFlow, {
  applyNodeChanges,
  Background,
  Controls,
  Edge,
  MarkerType,
  MiniMap,
} from "reactflow";

import { Button, Modal } from "react-bootstrap";
import {
  editTransferInStore,
  newTransferToStore,
  setStageToStore,
  storeStage,
} from "@/store/store";

import "reactflow/dist/style.css";

import { newStage } from "@/store/types";
import NavBar from "@/components/UI/NavBar/NavBar";
import UpNavBar from "@/components/UI/NavBar/UpNavBar";
import CustomHead from "@/components/Global/CustomHead";
import EditActions from "@/components/EditStage/EditActions/EditActions";
import { MdCreate, MdMap, MdTextSnippet } from "react-icons/md";
import { NodeStage } from "@/components/Nodes/StageNode";
import MapStage from "@/components/EditStage/MapStage";
import CreateTransfer from "@/components/EditStage/CreateTransfer/CreateTransfer";
import EditStage from "../../../components/EditStage/EditStage";

export default function ChapterEditById() {
  const { query, isReady } = useRouter();
  const chapterRoute = (query.chapter as string[]) || [];

  const [chapter, setChapter] = useState<any>();

  const [nodes, setNodes] = useState<any[]>();
  const [edges, setEdges] = useState<any[]>();

  const [showPopoverStage, setShowPopoverStage] = useState<boolean>(false); // для создания стадии
  const [showEditStage, setShowEditStage] = useState<any>();

  const [showModalEditTransfer, setShowModalEditTransfer] =
    useState<boolean>(false);

  const [connectionInfo, setConnectionInfo] = useState<any>();
  const [transferIndex, setTransferIndex] = useState<string>("");

  // Вытаскивание главы из localStorage
  useEffect(() => {
    const chapterFromLocalStorage =
      chapterRoute[0] &&
      store.get(`story_${chapterRoute[0]}_chapter_${chapterRoute[1]}`);

    setChapter(chapterFromLocalStorage);
  }, [isReady]);

  const updateChapter = (chapter: any, all: boolean) => {
    if (all) setChapter(chapter);

    if (chapterRoute[0]) {
      store.set(
        `story_${chapterRoute[0]}_chapter_${chapterRoute[1]}`,
        chapter,
        true
      );
    }
  };

  useEffect(() => {
    const initialNodes: any[] = [];
    const initialEdges: any[] = [];

    chapter?.stages?.map((stage: any) => {
      initialNodes.push({
        id: String(stage.id),
        type: "nodeStage",
        selected: false,
        data: {
          label: (
            <>
              <button
                onClick={() => {
                  setStageToStore(null);
                  setShowEditStage(null);

                  setTimeout(() => {
                    setStageToStore(stage);
                    setShowEditStage(stage);
                  }, 0);
                }}
              >
                {stage.title ? stage.title : "Переход на карту"}
              </button>
            </>
          ),
          text: stage.texts && stage.texts[0].text,
        },
        position: { x: stage.editor.x, y: stage.editor.y },
      });
    });

    chapter?.stages?.map((stage: any) => {
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

    if (initialNodes.length !== 0) setNodes(initialNodes);
    if (initialEdges.length !== 0) setEdges(initialEdges);
  }, [chapter]);

  const onNodesChange = useCallback(
    (changes: any) => {
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
          chapterRoute[0] &&
          store.get(`story_${chapterRoute[0]}_chapter_${chapterRoute[1]}`)
            .stages;

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

  const onEdgesClick = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      const chapterFromLocalStorage =
        chapterRoute[0] &&
        store.get(`story_${chapterRoute[0]}_chapter_${chapterRoute[1]}`);

      const stage = chapterFromLocalStorage.stages.find(
        (stage: any) => stage.id === Number(edge.source)
      );

      const targetTransfer = stage?.transfers?.find(
        (transfer: any) => transfer.stage_id === edge.target
      );

      const indexTargetTransfer = stage?.transfers?.indexOf(targetTransfer);
      console.log(targetTransfer, indexTargetTransfer);
      setStageToStore({ ...stage, targetTransfer, indexTargetTransfer });
      setShowModalEditTransfer(true);
    },
    [chapter]
  );

  // Создание стадии
  const createStage = (type: string) => {
    const chapterFromLocalStorage =
      chapterRoute[0] &&
      store.get(`story_${chapterRoute[0]}_chapter_${chapterRoute[1]}`);

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
  const updateStage = async (stageId: number) => {
    const chapterFromLocalStorage =
      chapterRoute[0] &&
      store.get(`story_${chapterRoute[0]}_chapter_${chapterRoute[1]}`);

    const storeStageTrueId = chapterFromLocalStorage.stages.findIndex(
      (stage: any) =>
        stage ===
        chapterFromLocalStorage.stages.find(
          (stage: any) => stage.id === stageId
        )
    );

    const {
      id,
      type_stage,
      background_url,
      title,
      message,
      type_message,
      texts,
      transfers,
      actions,
    } = storeStage;

    const updatedStageWithUpdatedPosition = {
      id,
      type_stage,
      background_url,
      title,
      message,
      type_message,
      texts,
      transfers,
      actions,
      editor: {
        x: chapterFromLocalStorage.stages.find(
          (stage: any) => stage.id === stageId
        ).editor.x,
        y: chapterFromLocalStorage.stages.find(
          (stage: any) => stage.id === stageId
        ).editor.y,
      },
    };

    await chapterFromLocalStorage.stages.splice(
      storeStageTrueId,
      1,
      updatedStageWithUpdatedPosition
    );

    updateChapter(chapterFromLocalStorage, true);
  };

  const onConnect = useCallback(
    (connection: any) => {
      const chapterFromLocalStorage =
        chapterRoute[0] &&
        store.get(`story_${chapterRoute[0]}_chapter_${chapterRoute[1]}`);

      setConnectionInfo({
        source: connection.source,
        target: connection.target,
      });

      const targetTransfer = chapterFromLocalStorage?.stages[
        connection.source
      ].transfers.find(
        (transfer: any) => transfer.stage_id === connection.target
      );

      setStageToStore({
        ...chapterFromLocalStorage?.stages[connection.source],
        targetTransfer,
      });
    },
    [setEdges, chapter]
  );

  function deleteStage(id: number) {
    const chapterFromLocalStorage =
      chapterRoute[0] &&
      store.get(`story_${chapterRoute[0]}_chapter_${chapterRoute[1]}`);

    const indexStage = chapterFromLocalStorage?.stages?.indexOf(
      chapterFromLocalStorage?.stages?.find((stage: any) => stage.id === id)
    );

    chapterFromLocalStorage?.stages?.splice(indexStage, 1);

    chapterFromLocalStorage && updateChapter(chapterFromLocalStorage, true);
    setStageToStore(null);
    setShowEditStage(null);
  }

  const nodeTypes = useMemo(() => ({ nodeStage: NodeStage }), []);

  return (
    <>
      <CustomHead title={"Редактирование главы " + chapter?.id} />
      <main className="main">
        <UpNavBar />
        <hr />
        <NavBar>
          <div
            className="navbar__header no-select"
            onClick={() => setShowPopoverStage(!showPopoverStage)}
          >
            <MdCreate style={{ paddingTop: "4px" }} />
            Создать стадию
            {showPopoverStage && (
              <div className="stage-popover">
                <button
                  className="button-popover"
                  onClick={() => createStage("default")}
                >
                  <MdTextSnippet style={{ paddingTop: "5px" }} />
                  Диалог
                </button>
                <button
                  className="button-popover"
                  onClick={() => createStage("exit")}
                >
                  <MdMap style={{ paddingTop: "5px" }} />
                  Выход на карту
                </button>
              </div>
            )}
          </div>
        </NavBar>
        <div className="stage-body">
          {showEditStage && (
            <div className="editor-popover">
              <div className="stage-popover__header">
                Стадия {storeStage?.id}
                <div className="mx-auto"></div>
                <button
                  style={{ fontSize: "12px", paddingRight: "5px" }}
                  onClick={() => deleteStage(storeStage?.id)}
                >
                  Удалить
                </button>
                <button
                  style={{ fontSize: "12px" }}
                  onClick={() => {
                    setStageToStore(null);
                    setShowEditStage(null);
                  }}
                >
                  Закрыть
                </button>
              </div>
              <div
                style={{
                  height: "calc(100vh - 132px)",
                  overflow: "auto",
                }}
              >
                {(storeStage?.type_stage === 4 && (
                  <MapStage data={storeStage?.data} />
                )) || <EditStage data={showEditStage} />}
                {storeStage?.actions && <EditActions />}
                <button
                  onClick={() => {
                    updateStage(storeStage?.id);
                    setShowEditStage(null);
                  }}
                >
                  Сохранить
                </button>
              </div>
            </div>
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
            fitView
          >
            <MiniMap zoomable pannable />
            <Controls />
            <Background gap={20} />
          </ReactFlow>
        </div>
        <Modal
          show={connectionInfo}
          onHide={() => {
            setConnectionInfo(null);
            setTransferIndex("");
          }}
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
            <textarea
              style={{ border: "2px solid #242424", width: "470px" }}
              placeholder="Введите текст..."
              defaultValue={connectionInfo?.targetTransfer?.text}
              onChange={(event) => {
                setTransferIndex(
                  String(
                    newTransferToStore({
                      text: event.target.value,
                      stage_id: connectionInfo?.target,
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
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                updateStage(storeStage.id);
                setConnectionInfo(null);
                setTransferIndex("");
              }}
            >
              Сохранить
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setConnectionInfo(null);
                setTransferIndex("");
              }}
            >
              Закрыть
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={showModalEditTransfer}
          onHide={() => {
            setShowModalEditTransfer(true);
          }}
          backdrop="static"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              Переход с {storeStage?.id} на{" "}
              {storeStage?.targetTransfer?.stage_id}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <textarea
              style={{ border: "2px solid #242424", width: "470px" }}
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
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                updateStage(storeStage.id);
                setShowModalEditTransfer(false);
              }}
            >
              Сохранить
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setShowModalEditTransfer(false);
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
