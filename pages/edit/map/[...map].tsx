import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { mapType } from "@/store/types/mapType";
import store from "store2";
import CustomHead from "@/components/Global/CustomHead";
import NavBar from "@/components/UI/NavBar/NavBar";
import { Box, Button, Heading, Image, Spacer, Tooltip } from "@chakra-ui/react";
import ChangeThemeButton from "@/components/UI/NavBar/ChangeThemeButton";
import UserButton from "@/components/UI/NavBar/UserButton";
import { imagePoint, translateTypePoint } from "@/store/utils/map/typePoint";

export default function mapEdit() {
  const { query, isReady } = useRouter();
  const mapRoute = (query.map as string[]) || [];
  const [map, setMap] = useState<mapType>();

  useEffect(() => {
    setMap(store.get(`story_${mapRoute[0]}_map_${mapRoute[1]}`));
  }, [isReady]);

  const [diffHeight, setDiffHeight] = useState<number>(0);
  const [diffWidth, setDiffWidth] = useState<number>(0);

  const onLoadImage = (target: any) => {
    setDiffHeight(target.target.naturalHeight / target.target.clientHeight);
    setDiffWidth(target.target.naturalWidth / target.target.clientWidth);
    console.log(diffHeight, diffWidth);
  };

  console.log(map);
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
      <Box h="calc(100vh - 57px)" display="flex">
        <Box position="relative">
          <Image
            src={
              map?.editor?.url
                ? `/static/maps${map?.editor?.url}`
                : `/static/maps/map_${map?.tmx?.split(".")[0]}.png`
            }
            onLoad={(target: any) => onLoadImage(target)}
          />
          {map?.points.map((point) => (
            <Tooltip
              label={point.name + ". Тип: " + translateTypePoint(point.type)}
            >
              <Image
                w="20px"
                src={`/static/tags/${imagePoint(point.type)}`}
                position="absolute"
                left={`${+point.pos.split(":")[0] / diffWidth}px`}
                bottom={`${+point.pos.split(":")[1] / diffHeight}px`}
                alt={point.name}
                onClick={() => console.log(point)}
              />
            </Tooltip>
          ))}
        </Box>
        <Box>Опции</Box>
      </Box>
    </>
  );
}
