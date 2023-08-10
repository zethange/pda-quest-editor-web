import React, { useRef, useState } from "react";
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

  const { data } = useFetching<mapApiType[]>(
    "/pdanetwork/api/v1/admin/quest/maps/all"
  );
  const mapBackground = data?.find((map) => {
    return +map.id === +stage?.mapId;
  })?.background;

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

          console.log("Diff width: " + diffWidth);
          console.log("Diff height: " + diffHeight);
        } catch (e) {
          console.error(e);
        }
      };
      getData();
    }
  };

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
      <Box position="relative">
        <Box ref={parentMapRef}>
          <img
            src={"/static/maps/" + mapBackground}
            draggable={false}
            onLoad={(target) => onLoadImage(target)}
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
                Number(stage?.point?.pos.split(":")[0]) / diffWidth - 5
              }px`,
              bottom: `${
                Number(stage?.point?.pos.split(":")[1]) / diffHeight - (10 + 5)
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
    </Box>
  );
};

export default FromMapStage;
