import React, { createRef, useEffect, useState } from "react";
import { useRouter } from "next/router";
import store from "store2";
import { chapterType } from "@/store/types/types";
import {
  mapApiType,
  mapType,
  pointType,
  spawnType,
} from "@/store/types/mapType";
import { useAppDispatch, useAppSelector } from "@/store/reduxHooks";
import {
  addSpawn,
  onPointCreate,
  setMap,
  setOpenPoint,
  setOpenSpawn,
} from "@/store/reduxStore/mapSlice";
import { Store } from "redux";
import { RootState } from "@/store/reduxStore";
import { useStore } from "react-redux";
import useFetching from "@/hooks/useFetching";
import CustomHead from "@/components/Global/CustomHead";
import NavBar from "@/components/UI/NavBar/NavBar";
import {
  Box,
  Button,
  Heading,
  Image,
  Spacer,
  Switch,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import ChangeThemeButton from "@/components/UI/NavBar/ChangeThemeButton";
import { imagePoint, translateTypePoint } from "@/store/utils/map/typePoint";
import CreatePointButtons from "@/components/Map/Points/CreatePointButtons";
import CreatePointModal from "@/components/Map/Points/CreatePointModal";
import UpdatePointModal from "@/components/Map/Points/UpdatePointModal";
import EditSpawnModal from "@/components/Map/Spawns/EditSpawnModal";
import { v4 as uuidv4 } from "uuid";

// /edit/chapter/maps/{storyId}/{chapterId}/{mapId}
const MapChapter = () => {
  const { query, isReady } = useRouter();
  const dispatch = useAppDispatch();
  const storeRedux: Store<RootState> = useStore();
  const map = useAppSelector((state) => state.map.map);
  const [chapter, setChapter] = useState<chapterType>();

  useEffect(() => {
    if (query.map) {
      const chapter = store.get(
        `story_${query.map![0]}_chapter_${query.map![1]}`
      ) as chapterType;
      setChapter(chapter);
      const map = store.get(
        `story_${query.map![0]}_maps_${query.map![2]}`
      ) as mapType;
      if (!chapter.points) {
        chapter.points = {};
      }
      if (!chapter.spawns) {
        chapter.spawns = {};
      }
      const points =
        chapter.points![String(query.map![2]) as `${number}`]! || [];
      const spawns =
        chapter.spawns![String(query.map![2]) as `${number}`]! || [];
      dispatch(setMap({ ...map, points, spawns }));
    }
  }, [isReady]);

  // опции
  const [showQuestPoints, setShowQuestPoints] = useState(true);
  const [showSpawns, setShowSpawns] = useState(true);

  const [background, setBackground] = useState("");

  const [showCreatePointModal, setShowCreatePointModal] = useState(false);
  const [showEditPointModal, setShowEditPointModal] = useState(false);
  const [showEditSpawn, setShowEditSpawn] = useState(false);

  const parentMapRef: React.RefObject<any> = createRef();

  const { data: dataMaps, isLoading } = useFetching<mapApiType[]>(
    "/pdanetwork/api/v1/admin/quest/maps/all"
  );
  useEffect(() => {
    const back = dataMaps?.find((mapApi) => {
      return +mapApi?.id === +storeRedux.getState().map.map.id;
    });
    console.log(back);
    setBackground(back?.background as string);
  }, [isLoading]);

  const updateMap = () => {
    const map = storeRedux.getState().map.map;
    const copyChapter = JSON.parse(JSON.stringify(chapter));
    copyChapter.points[`${query.map![2]}`] = map.points;
    copyChapter.spawns[`${query.map![2]}`] = map.spawns;
    console.log(copyChapter);
    store.set(`story_${query.map![0]}_chapter_${query.map![1]}`, copyChapter);
  };

  const [diffHeight, setDiffHeight] = useState<number>(0);
  const [diffWidth, setDiffWidth] = useState<number>(0);

  const [selectedPoint, setSelectedPoint] = useState("");

  const onLoadImage = (target: any) => {
    setDiffHeight(target.target.naturalHeight / target.target.clientHeight);
    setDiffWidth(target.target.naturalWidth / target.target.clientWidth);
  };

  const onDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData("application/pdaquesteditor", type);
    e.dataTransfer.effectAllowed = "move";
  };
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent | any) => {
    e.preventDefault();
    e.stopPropagation();

    const parentMap = parentMapRef.current.getBoundingClientRect();
    const position = {
      x: Math.round((e.clientX - parentMap.left) * diffHeight),
      y: Math.round(
        e.target.naturalHeight - (e.clientY - parentMap.top) * diffHeight
      ),
    };

    const data = e.dataTransfer.getData("application/pdaquesteditor") as string;
    if (data !== "spawn") {
      dispatch(
        onPointCreate({
          type: +data,
          pos: `${position.x}:${position.y}`,
          name: "",
          data: { chapter: "", stage: "" },
          condition: {},
          id: uuidv4(),
          editor: {
            x: 0,
            y: 0,
          },
        })
      );
      setShowCreatePointModal(true);
    } else {
      dispatch(addSpawn(`${position.x}:${position.y}`));
    }
  };

  if (query.map) {
    return (
      <>
        <CustomHead title={`Редактирование карты ${map?.title}`} />
        <NavBar>
          <Button fontWeight="normal" onClick={() => history.go(-1)}>
            Назад
          </Button>
          <Heading fontSize={25}>{map?.title}</Heading>
          <Spacer />
          <ChangeThemeButton rounded={true} />
        </NavBar>
        <Box
          h="calc(100vh - 57px)"
          display="flex"
          justifyContent="space-between"
          p={10}
        >
          <Box
            position="relative"
            me={10}
            border="1px solid #000"
            ref={parentMapRef}
          >
            <Image
              onDrop={(e) => handleDrop(e)}
              onDragOver={(e) => handleDragOver(e)}
              onDragEnter={(e) => handleDragEnter(e)}
              onDragLeave={(e) => handleDragLeave(e)}
              draggable={false}
              userSelect="none"
              h="calc(100vh - (80px + 57px))"
              src={`/static/maps/${background}`}
              onLoad={(target: any) => onLoadImage(target)}
            />
            {showQuestPoints &&
              map?.points?.map((point: pointType) => (
                <Tooltip
                  key={point.name}
                  label={
                    point.name + ". Тип: " + translateTypePoint(point.type)
                  }
                >
                  <Image
                    w="18px"
                    draggable={false}
                    userSelect="none"
                    src={`/static/tags/${imagePoint(point.type)}`}
                    position="absolute"
                    left={`${+point.pos.split(":")[0] / diffWidth - 9}px`}
                    bottom={`${+point.pos.split(":")[1] / diffHeight - 9}px`}
                    alt={point.name}
                    transform={selectedPoint === point.name ? "scale(2)" : ""}
                    transition="all 0.3s ease-out"
                    onClick={() => {
                      dispatch(setOpenPoint(point));
                      setShowEditPointModal(true);
                    }}
                  />
                </Tooltip>
              ))}
            {showSpawns &&
              map?.spawns?.map((spawn: spawnType, index: number) => (
                <Tooltip
                  label={JSON.stringify(spawn, null, 2)}
                  key={spawn.title}
                >
                  <Box
                    w={`${spawn.r}px`}
                    h={`${spawn.r}px`}
                    background="#808080"
                    borderRadius="50%"
                    border="1px solid #000000"
                    opacity=".7"
                    draggable={false}
                    position="absolute"
                    onClick={() => {
                      dispatch(
                        setOpenSpawn({
                          openSpawn: spawn,
                          openSpawnIndex: index,
                        })
                      );
                      setShowEditSpawn(true);
                    }}
                    left={`${
                      +spawn.pos.split(":")[0] / diffWidth - +spawn.r / 2
                    }px`}
                    bottom={`${
                      +spawn.pos.split(":")[1] / diffHeight - +spawn.r / 2
                    }px`}
                  />
                </Tooltip>
              ))}
          </Box>
          <Box
            backgroundColor="gray.50"
            p={2}
            _dark={{ backgroundColor: "gray.700" }}
            borderRadius="10px"
            display="grid"
            alignContent="space-between"
          >
            <Box>
              <Text>Опции</Text>
              <Box>
                Показывать точки квестов:{" "}
                <Switch
                  isChecked={showQuestPoints}
                  onChange={() => setShowQuestPoints(!showQuestPoints)}
                />
              </Box>
              <Box>
                Показывать спавны:{" "}
                <Switch
                  isChecked={showSpawns}
                  onChange={() => setShowSpawns(!showSpawns)}
                />
              </Box>
              <CreatePointButtons onDragStart={onDragStart} />
            </Box>
            <Box>
              Метки:
              <Box display="grid" gap={2} h="200px" overflowY="auto">
                {map?.points?.map((point: pointType) => (
                  <Button
                    p={1}
                    fontWeight="normal"
                    backgroundColor="white"
                    borderRadius="10px"
                    onMouseEnter={() => setSelectedPoint(point.name)}
                    onMouseLeave={() => setSelectedPoint("")}
                    onClick={() => {
                      dispatch(setOpenPoint(point));
                      setShowEditPointModal(true);
                    }}
                    key={point.pos}
                  >
                    {point.name}
                  </Button>
                ))}
              </Box>
            </Box>
          </Box>
          <CreatePointModal
            showCreatePointModal={showCreatePointModal}
            setShowCreatePointModal={setShowCreatePointModal}
            updateMap={updateMap}
          />
          <UpdatePointModal
            showEditPointModal={showEditPointModal}
            setShowEditPointModal={setShowEditPointModal}
            storyId={query.map![0]}
            updateMap={updateMap}
          />
          <EditSpawnModal
            showEditSpawn={showEditSpawn}
            setShowEditSpawn={setShowEditSpawn}
            updateMap={updateMap}
          />
        </Box>
      </>
    );
  }
};

export default MapChapter;
