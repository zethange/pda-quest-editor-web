import { useEffect, useRef, useState } from "react";
import { Box, Input, Select } from "@chakra-ui/react";
import { useUnit } from "effector-react";
import type { MapApi as mapApiType, MapEntity as mapType } from "@/entities/map";
import { $userSettings } from "@/entities/user";
import { $maps, $stage, editMapInData, editPosInData } from "@/features/stage-editor";
import useFetching from "@/hooks/useFetching";
import Stage from "../../Global/Konva/Stage";
import KonvaMap from "../../Global/Konva/KonvaMap";
import KonvaImage from "@/components/Global/Konva/KonvaImage";
import { logger } from "@/store/utils/logger";

interface IProps {
  data:
    | {
        map: string;
        pos: string;
      }
    | undefined;
}

const MapStage = ({ data }: IProps) => {
  const [maps, stage, settings, editPosInDataEvent, editMapInDataEvent] = useUnit([
    $maps,
    $stage,
    $userSettings,
    editPosInData,
    editMapInData,
  ]);

  const map = maps.find((item: mapType) => item.id === data?.map);
  const parentMapRef = useRef<HTMLDivElement>(null);
  const [mapBackground, setMapBackground] = useState("");
  const [diffHeight, setDiffHeight] = useState(0);
  const [diffWidth, setDiffWidth] = useState(0);
  const [size, setSize] = useState({ height: 0, width: 0 });

  const { data: dataMaps } = useFetching<mapApiType[]>(
    "/pdanetwork/api/v1/admin/quest/maps/all"
  );

  useEffect(() => {
    setMapBackground(
      dataMaps?.find((item) => +item.id === +(stage?.data?.map || 0))
        ?.background as string
    );
  }, [dataMaps, stage?.data?.map]);

  const handleClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!parentMapRef.current) return;
    const parentMap = parentMapRef.current.getBoundingClientRect();
    const target = e.target as HTMLImageElement;
    const position = {
      x: Math.round((e.clientX - parentMap.left) * diffHeight),
      y: Math.round(target.naturalHeight - (e.clientY - parentMap.top) * diffHeight),
    };
    editPosInDataEvent(`${position.x}:${position.y}`);
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

  return (
    <Box>
      Переход на локацию:
      <Box>
        <Select
          defaultValue={stage?.data?.map}
          onChange={(event) => editMapInDataEvent(event.target.value)}
        >
          {maps.map((item: mapType) => (
            <option key={item.id} value={`${item.id}`}>
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
              onClick={(e) => editPosInDataEvent(`${e.x}:${e.y}`)}
              set={setSize}
            />
            <KonvaImage
              width={30}
              height={30}
              x={Number(stage?.data?.pos.split(":")[0]) - 15}
              y={size.height - Number(stage?.data?.pos.split(":")[1]) - 15}
              src="/quest.png"
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
                left: `${Number(stage?.data?.pos.split(":")[0]) / diffWidth - 5}px`,
                bottom: `${Number(stage?.data?.pos.split(":")[1]) / diffHeight - 15}px`,
                color: "#fff",
                userSelect: "none",
                width: "10px",
              }}
              draggable={false}
              alt="Метка"
              src="/quest.png"
            />
          </Box>
        )}
      </Box>
      <Box>
        Позиция:{" "}
        <Input
          placeholder="Позиция..."
          value={data?.pos}
          onChange={(e) => editPosInDataEvent(e.target.value)}
        />
      </Box>
    </Box>
  );
};

export default MapStage;
