import { useEffect, useRef, useState } from "react";
import { Box, Input, Select } from "@chakra-ui/react";
import { mapApiType, mapType } from "@/store/types/story/mapType";
import {
  editMapInData,
  editPosInData,
} from "@/store/reduxStore/slices/stageSlice";
import { stageType } from "@/store/types/story/chapterType";
import { useAppDispatch, useAppSelector } from "@/store/reduxStore/reduxHooks";
import useFetching from "@/hooks/useFetching";
import { logger } from "@/shared/lib/logger.ts";

import Stage from "../../Global/Konva/Stage";
import KonvaMap from "../../Global/Konva/KonvaMap";

import KonvaImage from "@/components/Global/Konva/KonvaImage";
import { API_URL } from "@/shared/config";

interface IProps {
  data:
    | {
        map: string;
        pos: string;
      }
    | undefined;
}

const MapStage = ({ data }: IProps) => {
  const dispatch = useAppDispatch();

  const maps: mapType[] = useAppSelector((state) => state.maps.maps);
  const map = maps.find((map: mapType) => map.id === data?.map);
  const stage: stageType = useAppSelector((state) => state.stage.stage);
  const settings = useAppSelector((state) => state.user.settings);

  const parentMapRef: any = useRef();

  const [mapBackground, setMapBackground] = useState("");

  const { data: dataMaps } = useFetching<mapApiType[]>(
    API_URL + "/api/v1/admin/quest/maps/all"
  );

  useEffect(() => {
    setMapBackground(
      dataMaps?.find((map) => {
        return +map.id === +stage?.data?.map!;
      })?.background as string
    );
  }, [dataMaps, stage?.data?.map]);

  const handleClick = (e: any) => {
    const parentMap = parentMapRef.current.getBoundingClientRect();
    const position = {
      x: Math.round((e.clientX - parentMap.left) * diffHeight),
      y: Math.round(
        e.target.naturalHeight - (e.clientY - parentMap.top) * diffHeight
      ),
    };
    dispatch(editPosInData(`${position.x}:${position.y}`));
  };

  const [diffHeight, setDiffHeight] = useState<number>(0);
  const [diffWidth, setDiffWidth] = useState<number>(0);

  const onLoadImage = (target: any) => {
    if (map) {
      const getData = async () => {
        try {
          const res = await fetch("https://pda-assets.pages.dev/" + map.tmx);
          const data = await res.text();

          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(data, "text/xml");
          const width = +(
            xmlDoc.getElementsByTagName("layer")[0].attributes as any
          ).width.nodeValue;
          const height = +(
            xmlDoc.getElementsByTagName("layer")[0].attributes as any
          ).height.nodeValue;

          const diffHeight = (height * 8) / target.target.clientHeight;
          const diffWidth = (width * 8) / target.target.clientWidth;

          setDiffHeight(diffHeight);
          setDiffWidth(diffWidth);

          logger.info("Diff width: " + diffWidth);
          logger.info("Diff height: " + diffHeight);
        } catch (e) {
          logger.error(e);
        }
      };
      getData();
    }
  };

  //
  const [size, setSize] = useState({ height: 0, width: 0 });

  return (
    <Box>
      Переход на локацию:
      <Box>
        <Select
          defaultValue={stage?.data?.map}
          onChange={(event) => dispatch(editMapInData(event.target.value))}
        >
          {maps.map((map: mapType) => (
            <option key={map.id} value={`${map.id}`}>
              {map.title}
            </option>
          ))}
        </Select>
      </Box>
      <Box position="relative" border="1px solid #000">
        {(settings.alternativeMapViewer && !!mapBackground && (
          <>
            <Stage width={430} height={500}>
              <KonvaMap
                props={{
                  src: "/static/maps/" + mapBackground,
                }}
                onClick={(e) => {
                  dispatch(editPosInData(`${e.x}:${e.y}`));
                }}
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
          </>
        )) || (
          <Box ref={parentMapRef}>
            <img
              src={"/static/maps/" + mapBackground}
              draggable={false}
              onLoad={(target: any) => onLoadImage(target)}
              onClick={(e) => handleClick(e)}
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
                left: `${
                  Number(stage?.data?.pos.split(":")[0]) / diffWidth - 5
                }px`,
                bottom: `${
                  Number(stage?.data?.pos.split(":")[1]) / diffHeight - (10 + 5)
                }px`,
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
          onChange={(e) => dispatch(editPosInData(e.target.value))}
        />
      </Box>
    </Box>
  );
};

export default MapStage;
