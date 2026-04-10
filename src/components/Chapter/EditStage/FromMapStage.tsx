import { useEffect, useRef, useState } from "react";
import { Box, Input, Select } from "@chakra-ui/react";
import { useUnit } from "effector-react";
import {
  MapApi as mapApiType,
  MapEntity as mapType,
  QuestPoint as pointType,
  typePoints,
} from "@/entities/map";
import { $userSettings } from "@/entities/user";
import {
  $maps,
  $transitionFromMap,
  editConditionInPoint,
  editMapIdInTransition,
  editPosInTransition,
  editTransition,
} from "@/features/stage-editor";
import useFetching from "@/hooks/useFetching";
import ConditionListRefactor from "@/components/Chapter/EditStage/CreateTransfer/ConditionList/ConditionListRefactor";
import { imagePoint } from "@/store/utils/map/typePoint";
import EditActionsRefactor from "./EditActions/EditActionsRefactor";
import Stage from "../../Global/Konva/Stage";
import KonvaMap from "../../Global/Konva/KonvaMap";
import KonvaImage from "@/components/Global/Konva/KonvaImage";
import { logger } from "@/store/utils/logger";

export interface IFromMapStage {
  id: number;
  mapId: `${number}`;
  type_stage: 777;
  point: pointType;
}

const FromMapStage = () => {
  const [
    maps,
    stage,
    settings,
    editMapIdInTransitionEvent,
    editPosInTransitionEvent,
    editTransitionEvent,
  ] = useUnit([
    $maps,
    $transitionFromMap,
    $userSettings,
    editMapIdInTransition,
    editPosInTransition,
    editTransition,
  ]);

  const map = maps.find((item: mapType) => +item.id === +(stage?.mapId || 0));
  const [mapBackground, setMapBackground] = useState("");
  const { data } = useFetching<mapApiType[]>("/pdanetwork/api/v1/admin/quest/maps/all");
  const parentMapRef = useRef<HTMLDivElement>(null);
  const [diffHeight, setDiffHeight] = useState(0);
  const [diffWidth, setDiffWidth] = useState(0);
  const [size, setSize] = useState({ height: 0, width: 0 });

  useEffect(() => {
    setMapBackground(
      data?.find((item) => +item.id === +(stage?.mapId || 0))?.background as string
    );
  }, [data, stage?.mapId]);

  const handleClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!parentMapRef.current) return;
    const parentMap = parentMapRef.current.getBoundingClientRect();
    const target = e.target as HTMLImageElement;
    const position = {
      x: Math.round((e.clientX - parentMap.left) * diffWidth),
      y: Math.round(target.naturalHeight - (e.clientY - parentMap.top) * diffHeight - diffHeight),
    };
    editPosInTransitionEvent(`${position.x}:${position.y}`);
  };

  const onLoadImage = (target: React.SyntheticEvent<HTMLImageElement>) => {
    if (!map) return;
    const getData = async () => {
      try {
        const res = await fetch("https://pda-assets.pages.dev/" + map.tmx);
        const xml = await res.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xml, "text/xml");
        const layer = xmlDoc.getElementsByTagName("layer")[0];
        const width = Number(layer.attributes.getNamedItem("width")?.nodeValue ?? 0);
        const height = Number(layer.attributes.getNamedItem("height")?.nodeValue ?? 0);
        const diffH = (height * 8) / target.currentTarget.clientHeight;
        const diffW = (width * 8) / target.currentTarget.clientWidth;
        setDiffHeight(diffH);
        setDiffWidth(diffW);
        logger.info("Diff width: " + diffW);
        logger.info("Diff height: " + diffH);
      } catch (error) {
        logger.error(error);
      }
    };
    void getData();
  };

  if (!stage) {
    return null;
  }

  return (
    <Box>
      Переход из локации:
      <Box>
        <Select
          defaultValue={stage.mapId}
          onChange={(event) => editMapIdInTransitionEvent(event.target.value as `${number}`)}
        >
          {maps.map((item: mapType) => (
            <option value={`${item.id}`} key={item.id}>
              {item.title}
            </option>
          ))}
        </Select>
      </Box>
      <Box position="relative" border="1px solid #000">
        {(settings.alternativeMapViewer && !!mapBackground && (
          <Stage width={430} height={500}>
            <KonvaMap
              props={{ src: "/static/maps/" + mapBackground }}
              onClick={(e) => editPosInTransitionEvent(`${e.x}:${e.y}`)}
              set={setSize}
            />
            <KonvaImage
              width={30}
              height={30}
              x={Number(stage.point?.pos.split(":")[0]) - 15}
              y={size.height - Number(stage.point?.pos.split(":")[1]) - 15}
              src={`/static/tags/${imagePoint(+stage.point?.type)}`}
            />
          </Stage>
        )) || (
          <Box ref={parentMapRef}>
            <img
              src={"/static/maps/" + mapBackground}
              draggable={false}
              onLoad={onLoadImage}
              onClick={handleClick}
              style={{
                borderRadius: "5px",
                marginTop: "5px",
                width: "450px",
                userSelect: "none",
              }}
              alt={map?.title}
            />
            <img
              style={{
                position: "absolute",
                left: `${Number(stage.point?.pos.split(":")[0]) / diffWidth - 5}px`,
                bottom: `${Number(stage.point?.pos.split(":")[1]) / diffHeight - 15}px`,
                color: "#fff",
                userSelect: "none",
                width: "10px",
              }}
              draggable={false}
              alt="Метка"
              src={`/static/tags/${imagePoint(+stage.point?.type)}`}
            />
          </Box>
        )}
      </Box>
      <Select
        mt={2}
        defaultValue={String(stage.point?.type)}
        onChange={(e) => editTransitionEvent({ type: +e.target.value })}
      >
        {typePoints.map((type) => (
          <option key={type[0]} value={type[0]}>
            {type[1]}
          </option>
        ))}
      </Select>
      <Box>
        Позиция:{" "}
        <Input
          placeholder="Позиция..."
          value={stage.point?.pos}
          onChange={(e) => editPosInTransitionEvent(e.target.value)}
        />
      </Box>
      <Box>
        Название точки:
        <Input
          value={stage.point?.name}
          onChange={(e) => editTransitionEvent({ name: e.target.value })}
        />
      </Box>
      <ConditionListRefactor
        condition={stage.point.condition!}
        onChangeCondition={editConditionInPoint}
      />
      <EditActionsRefactor
        actions={stage.point?.actions!}
        onChangeActions={editTransition}
        withField
      />
    </Box>
  );
};

export default FromMapStage;
