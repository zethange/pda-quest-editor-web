import { useRouter } from "next/router";
import React, { createRef, useEffect, useState } from "react";
import { mapType } from "@/store/types/mapType";
import store from "store2";
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
import UserButton from "@/components/UI/NavBar/UserButton";
import { imagePoint, translateTypePoint } from "@/store/utils/map/typePoint";
import CreatePointButtons from "@/components/Map/CreatePointButtons";

import { useSelector, useDispatch } from "react-redux";
import {
  onPointCreate,
  setMap,
  setOpenPoint,
} from "@/store/reduxStore/mapSlice";
import CreatePointModal from "@/components/Map/CreatePointModal";
import UpdatePointModal from "@/components/Map/UpdatePointModal";

export default function mapEdit() {
  const { query, isReady } = useRouter();
  const mapRoute = (query.map as string[]) || [];

  const map: mapType = useSelector((state: any) => state.map.map);
  const dispatch = useDispatch();

  // опции
  const [showQuestPoints, setShowQuestPoints] = useState(true);
  const [showSpawns, setShowSpawns] = useState(false);

  const [showCreatePointModal, setShowCreatePointModal] = useState(false);
  const [showEditPointModal, setShowEditPointModal] = useState(false);

  const parentMapRef: React.RefObject<any> = createRef();

  useEffect(() => {
    dispatch(
      setMap({ map: store.get(`story_${mapRoute[0]}_map_${mapRoute[1]}`) })
    );
  }, [isReady]);

  const updateMap = () => {
    store.set(`story_${mapRoute[0]}_map_${mapRoute[1]}`, map);
    console.log("updating map:", map);
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
    setShowCreatePointModal(true);
    dispatch(
      onPointCreate({
        type: data,
        pos: `${position.x}:${position.y}`,
        name: "",
        data: { chapter: "", stage: "" },
      })
    );
  };

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
        <UserButton />
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
            src={
              map?.editor?.url
                ? `/static/maps${map?.editor?.url}`
                : `/static/maps/map_${map?.tmx?.split(".")[0]}.png`
            }
            onLoad={(target: any) => onLoadImage(target)}
          />
          {showQuestPoints &&
            map?.points?.map((point) => (
              <Tooltip
                key={point.name}
                label={point.name + ". Тип: " + translateTypePoint(point.type)}
              >
                <Image
                  w="20px"
                  draggable={false}
                  userSelect="none"
                  src={`/static/tags/${imagePoint(point.type)}`}
                  position="absolute"
                  left={`${+point.pos.split(":")[0] / diffWidth}px`}
                  bottom={`${+point.pos.split(":")[1] / diffHeight}px`}
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
            map?.spawns?.map((spawn) => (
              <Tooltip label={JSON.stringify(spawn, null, 2)}>
                <Image
                  w="10px"
                  draggable={false}
                  src={`/static/tags/yellow.png`}
                  position="absolute"
                  left={`${+spawn.pos.split(":")[0] / diffWidth}px`}
                  bottom={`${+spawn.pos.split(":")[1] / diffHeight}px`}
                  onClick={() => console.log(spawn)}
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
              {map?.points?.map((point) => (
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
          storyId={mapRoute[0]}
          updateMap={updateMap}
        />
      </Box>
    </>
  );
}
