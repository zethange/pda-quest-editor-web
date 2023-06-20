import { memo, useRef, useState } from "react";
import { Box, Select } from "@chakra-ui/react";
import { mapApiType, mapType } from "@/store/types/mapType";
import { editMapInData, editPosInData } from "@/store/reduxStore/stageSlice";
import { stageType } from "@/store/types/types";
import { useAppDispatch, useAppSelector } from "@/store/reduxHooks";
import useFetching from "@/hooks/useFetching";

interface IProps {
  data:
    | {
        map: string;
        pos: string;
      }
    | undefined;
}

const MapStage = memo(({ data }: IProps) => {
  const dispatch = useAppDispatch();

  const maps: mapType[] = useAppSelector((state) => state.maps.maps);
  const map = maps.find((map: mapType) => map.id === data?.map);
  const stage: stageType = useAppSelector((state) => state.stage.stage);

  const parentMapRef: any = useRef();

  const { data: dataMaps } = useFetching<mapApiType[]>(
    "/pdanetwork/api/v1/admin/quest/maps/all"
  );

  if (dataMaps) {
    var backgroundSelectedMap = dataMaps.find((map: mapApiType) => {
      if (stage?.data?.map) {
        if (+map.id === +stage.data.map) console.log(stage, map);
        return +map.id === +stage?.data?.map;
      }
    })?.background;
  }

  const handleClick = (e: any) => {
    const parentMap = parentMapRef.current.getBoundingClientRect();
    const position = {
      x: Math.round((e.clientX - parentMap.left) * diffHeight),
      y: Math.round(
        e.target.naturalHeight - (e.clientY - parentMap.top) * diffHeight
      ),
    };
    console.log(position);
    dispatch(editPosInData(`${position.x}:${position.y}`));
  };

  const [diffHeight, setDiffHeight] = useState<number>(0);
  const [diffWidth, setDiffWidth] = useState<number>(0);

  const onLoadImage = (target: any) => {
    setDiffHeight(target.target.naturalHeight / target.target.clientHeight);
    setDiffWidth(target.target.naturalWidth / target.target.clientWidth);
  };

  return (
    <Box>
      Переход на локацию:
      <Box>
        <Select
          defaultValue={stage?.data?.map}
          onChange={(event) => dispatch(editMapInData(event.target.value))}
        >
          {maps.map((map: mapType) => (
            <option value={`${map.id}`}>{map.title}</option>
          ))}
        </Select>
      </Box>
      <Box position="relative">
        <Box ref={parentMapRef}>
          <img
            src={"/static/maps/" + backgroundSelectedMap}
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
                Number(stage?.data?.pos.split(":")[0]) / diffWidth - 10
              }px`,
              bottom: `${
                Number(stage?.data?.pos.split(":")[1]) / diffHeight - 10
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
      <p>Позиция: {data?.pos}</p>
    </Box>
  );
});

export default MapStage;
