import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SimpleGrid,
} from "@chakra-ui/react";
import store from "store2";
import { mapApiType, mapType } from "@/store/types/mapType";
import Link from "next/link";
import { createMap } from "@/store/tools/mapTools";
import useFetching from "@/hooks/useFetching";
import { useAppDispatch } from "@/store/reduxHooks";
import { setMaps as setMapsRedux } from "@/store/reduxStore/chapterMapsSlice";

interface Props {
  path: string[];
  isReady: boolean;
}

const MapScreen = ({ path, isReady }: Props) => {
  const [maps, setMaps] = useState<mapType[]>([]);
  const { data, isLoading } = useFetching<mapApiType[]>(
    "/pdanetwork/api/v1/admin/quest/maps/all"
  );
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!isLoading) {
      store.each((key, value: mapType) => {
        if (
          key.includes(`story_${path[0]}_maps`) &&
          !maps.find((map) => +map.id === +value.id)
        ) {
          setMaps((maps) => [...maps, value]);
        }
        if (key === "stopLoop") return false;
      });
    }
  }, [isReady, isLoading]);

  const handleCreateMap = (map: mapApiType) => {
    const newMap = createMap(map);
    if (newMap) {
      setMaps([...maps, newMap]);
      dispatch(setMapsRedux(newMap));
      store.set(`story_${path[0]}_maps_${newMap.id}`, newMap);
    }
  };

  const deleteMap = (mapId: number) => {
    setMaps(maps.filter((map) => +map.id !== mapId));
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i) as string;
      if (key.includes(`story_${path[0]}_chapter`)) {
        const value: any = JSON.parse(localStorage.getItem(key) as string);
        if (value.points![mapId]) {
          delete value.points[mapId];
        }
        if (value.spawns![mapId]) {
          delete value.spawns[mapId];
        }
        localStorage.setItem(key, JSON.stringify(value));
      }
    }
    localStorage.removeItem(`story_${path[0]}_maps_${mapId}`);
    location.reload();
  };

  return (
    <>
      <Box display="flex" p={0} gap={2} mb={4} alignItems="center">
        <Menu>
          <MenuButton as={Button}>Создать карту</MenuButton>
          <MenuList>
            {data?.map((map) => (
              <MenuItem onClick={() => handleCreateMap(map)} key={map.id}>
                {map.title}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </Box>
      <Box>
        <SimpleGrid columns={4} spacing={5}>
          {maps.map((map: mapType) => (
            <Card
              key={map.id}
              border="1px"
              borderColor="gray.200"
              _dark={{
                borderColor: "gray.600",
                color: "white",
              }}
              shadow="none"
              p={2}
            >
              {map?.title}
              <Flex gap={2}>
                <Link
                  href={`/edit/chapter/maps/${path[0]}/${path[1]}/${map.id}`}
                >
                  <Button colorScheme="teal">Редактировать</Button>
                </Link>
                <Button colorScheme="red" onClick={() => deleteMap(+map.id)}>
                  Удалить
                </Button>
              </Flex>
              {/*<Image src={`/static/maps${map?.editor?.url}`} />*/}
            </Card>
          ))}
        </SimpleGrid>
      </Box>
    </>
  );
};

export default MapScreen;
