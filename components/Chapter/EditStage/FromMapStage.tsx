"use client";

import { useEffect, useRef, useState } from "react";
import { Box, Input, Select } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "@/store/reduxHooks";
import {
  mapApiType,
  mapType,
  pointType,
  typePoints,
} from "@/store/types/mapType";
import {
  editConditionInPoint,
  editMapIdInTransition,
  editPosInTransition,
  editTransition,
} from "@/store/reduxStore/stageSlice";
import useFetching from "@/hooks/useFetching";
import ConditionListRefactor from "@/components/Chapter/EditStage/CreateTransfer/ConditionList/ConditionListRefactor";
import { imagePoint } from "@/store/utils/map/typePoint";
import EditActionsRefactor from "./EditActions/EditActionsRefactor";
import dynamic from "next/dynamic";

const Stage = dynamic(() => import("../../Global/Konva/Stage"), {
  ssr: false,
});
const KonvaMap = dynamic(() => import("../../Global/Konva/KonvaMap"), {
  ssr: false,
});

import { logger } from "@/store/utils/logger";

const KonvaImage = dynamic(
  () => import("@/components/Global/Konva/KonvaImage"),
  {
    ssr: false,
  }
);

export interface IFromMapStage {
  id: number;
  mapId: `${number}`;
  type_stage: 777;
  point: pointType;
}

const FromMapStage = () => {
  const dispatch = useAppDispatch();
  const maps: mapType[] = useAppSelector((state) => state.maps.maps);
  const stage = useAppSelector((state) => state.stage.transitionFromMap);
  const map: mapType | undefined = maps.find((map: mapType) => {
    return +map.id === +stage?.mapId;
  });
  const settings = useAppSelector((state) => state.user.settings);
  const [mapBackground, setMapBackground] = useState("");

  const { data } = useFetching<mapApiType[]>(
    "/pdanetwork/api/v1/admin/quest/maps/all"
  );

  useEffect(() => {
    setMapBackground(
      data?.find((map) => {
        return +map.id === +stage?.mapId;
      })?.background as string
    );
  }, [data]);

  const parentMapRef: any = useRef();

  const handleClick = (e: any) => {
    const parentMap = parentMapRef.current.getBoundingClientRect();
    const position = {
      x: Math.round((e.clientX - parentMap.left) * diffWidth),
      y: Math.round(
        e.target.naturalHeight -
          (e.clientY - parentMap.top) * diffHeight -
          diffHeight
      ),
    };
    dispatch(editPosInTransition(`${position.x}:${position.y}`));
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
      Переход из локации:
      <Box>
        <Select
          defaultValue={stage?.mapId}
          onChange={(event) =>
            dispatch(editMapIdInTransition(event.target.value))
          }
        >
          {maps.map((map: mapType) => (
            <option value={`${map.id}`} key={map.id}>
              {map.title}
            </option>
          ))}
        </Select>
      </Box>
      <Box position="relative" border="1px solid #000">
        {(settings.alternativeMapViewer && !!mapBackground && (
          <Stage width={430} height={500}>
            <KonvaMap
              props={{
                src: "/static/maps/" + mapBackground,
              }}
              onClick={(e) => {
                dispatch(editPosInTransition(`${e.x}:${e.y}`));
              }}
              set={setSize}
            />
            <KonvaImage
              width={30}
              height={30}
              x={Number(stage?.point?.pos.split(":")[0]) - 15}
              y={size.height - Number(stage?.point?.pos.split(":")[1]) - 15}
              src={`/static/tags/${imagePoint(+stage?.point?.type)}`}
            />
          </Stage>
        )) || (
          <Box ref={parentMapRef}>
            <img
              src={"/static/maps/" + mapBackground}
              draggable={false}
              onLoad={(target) => onLoadImage(target)}
              onClick={(e) => {
                logger.info(e);
                handleClick(e);
              }}
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
                  Number(stage?.point?.pos.split(":")[0]) / diffWidth - 5
                }px`,
                bottom: `${
                  Number(stage?.point?.pos.split(":")[1]) / diffHeight -
                  (10 + 5)
                }px`,
                color: "#fff",
                userSelect: "none",
                width: "10px",
              }}
              draggable={false}
              alt="Метка"
              src={`/static/tags/${imagePoint(+stage?.point?.type)}`}
            />
          </Box>
        )}
      </Box>
      <Select
        mt={2}
        defaultValue={String(stage?.point?.type)}
        onChange={(e) => {
          dispatch(
            editTransition({
              type: +e.target.value,
            })
          );
        }}
      >
        {typePoints.map((type) => (
          <option value={type[0]}>{type[1]}</option>
        ))}
      </Select>
      <Box>
        Позиция:{" "}
        <Input
          placeholder="Позиция..."
          value={stage?.point?.pos}
          onChange={(e) => dispatch(editPosInTransition(e.target.value))}
        />
      </Box>
      <Box>
        Название точки:
        <Input
          value={stage?.point?.name}
          onChange={(e) =>
            dispatch(
              editTransition({
                name: e.target.value,
              })
            )
          }
        />
      </Box>
      <ConditionListRefactor
        condition={stage.point.condition!}
        onChangeCondition={editConditionInPoint}
      />
      <EditActionsRefactor
        actions={stage?.point?.actions!}
        onChangeActions={editTransition}
        withField
      />
    </Box>
  );
};

export default FromMapStage;
