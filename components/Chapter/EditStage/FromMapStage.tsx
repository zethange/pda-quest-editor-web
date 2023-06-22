import React, { useRef, useState } from "react";
import { Box, Select } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "@/store/reduxHooks";
import { mapApiType, mapType, pointType } from "@/store/types/mapType";
import {
  createConditionInPoint,
  createValueInPoint,
  deleteConditionInPoint,
  deleteValueInPoint,
  editMapIdInTransition,
  editPosInTransition,
  editValueInPoint,
} from "@/store/reduxStore/stageSlice";
import { useSelector } from "react-redux";
import useFetching from "@/hooks/useFetching";
import ConditionList from "@/components/Chapter/EditStage/CreateTransfer/ConditionList";

export interface IFromMapStage {
  id: number;
  mapId: `${number}`;
  type_stage: 777;
  point: pointType;
}

const FromMapStage = () => {
  const dispatch = useAppDispatch();
  const maps: mapType[] = useAppSelector((state) => state.maps.maps);
  const stage: IFromMapStage = useSelector(
    (state: any) => state.stage.transitionFromMap
  );
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
      x: Math.round((e.clientX - parentMap.left) * diffHeight),
      y: Math.round(
        e.target.naturalHeight - (e.clientY - parentMap.top) * diffHeight
      ),
    };
    dispatch(editPosInTransition(`${position.x}:${position.y}`));
  };

  const [diffHeight, setDiffHeight] = useState<number>(0);
  const [diffWidth, setDiffWidth] = useState<number>(0);

  const onLoadImage = (target: React.SyntheticEvent<HTMLImageElement>) => {
    setDiffHeight(
      (target.target as HTMLImageElement).naturalHeight /
        (target.target as HTMLImageElement).clientHeight
    );
    setDiffWidth(
      (target.target as HTMLImageElement).naturalWidth /
        (target.target as HTMLImageElement).clientWidth
    );
  };

  return (
    <Box>
      Переход на локацию:
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
                Number(stage?.point?.pos.split(":")[0]) / diffWidth - 10
              }px`,
              bottom: `${
                Number(stage?.point?.pos.split(":")[1]) / diffHeight - 10
              }px`,
              color: "#fff",
              userSelect: "none",
              width: "20px",
            }}
            draggable={false}
            alt="Метка"
            src="/quest.png"
          />
        </Box>
      </Box>
      <p>Позиция: {stage?.point?.pos}</p>
      <ConditionList
        condition={stage.point.condition!}
        createCondition={createConditionInPoint}
        createValue={createValueInPoint}
        deleteCondition={deleteConditionInPoint}
        deleteValue={deleteValueInPoint}
        editValue={editValueInPoint}
      />
    </Box>
  );
};

export default FromMapStage;
