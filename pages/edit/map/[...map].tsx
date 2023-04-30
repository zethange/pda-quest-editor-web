import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
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

export default function mapEdit() {
  const { query, isReady } = useRouter();
  const mapRoute = (query.map as string[]) || [];
  const [map, setMap] = useState<mapType>();
  const [showQuestPoints, setShowQuestPoints] = useState(true);
  const [showSpawns, setShowSpawns] = useState(false);

  useEffect(() => {
    setMap(store.get(`story_${mapRoute[0]}_map_${mapRoute[1]}`));
  }, [isReady]);

  const [diffHeight, setDiffHeight] = useState<number>(0);
  const [diffWidth, setDiffWidth] = useState<number>(0);

  const onLoadImage = (target: any) => {
    setDiffHeight(target.target.naturalHeight / target.target.clientHeight);
    setDiffWidth(target.target.naturalWidth / target.target.clientWidth);
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
      <Box
        h="calc(100vh - 57px)"
        display="flex"
        justifyContent="space-between"
        p={10}
      >
        <Box position="relative" me={10} border="1px solid #000">
          <Image
            h="calc(100vh - (80px + 57px))"
            src={
              map?.editor?.url
                ? `/static/maps${map?.editor?.url}`
                : `/static/maps/map_${map?.tmx?.split(".")[0]}.png`
            }
            onLoad={(target: any) => onLoadImage(target)}
          />
          {showQuestPoints &&
            map?.points.map((point) => (
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
          {showSpawns &&
            map?.spawns?.map((spawn) => (
              <Tooltip label={JSON.stringify(spawn, null, 2)}>
                <Image
                  w="10px"
                  src={`/static/tags/yellow.png`}
                  position="absolute"
                  left={`${+spawn.pos.split(":")[0] / diffWidth}px`}
                  bottom={`${+spawn.pos.split(":")[1] / diffHeight}px`}
                  onClick={() => console.log(spawn)}
                />
              </Tooltip>
            ))}
        </Box>
        <Box backgroundColor="gray.50">
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
        </Box>
      </Box>
    </>
  );
}
