import React, { Fragment, useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SimpleGrid,
} from "@chakra-ui/react";
import store from "store2";
import { mapType } from "@/store/types/mapType";
import Link from "next/link";
import { createMap, Map } from "@/store/tools/mapTools";

interface Props {
  path: string[];
  isReady: boolean;
}

const MapScreen = ({ path, isReady }: Props) => {
  const [maps, setMaps] = useState<mapType[]>([]);

  useEffect(() => {
    store.each((key, value) => {
      if (key.includes(`story_${path[0]}_map`)) {
        console.log(key, value, maps);
        setMaps((map: any) => [...map, value]);
      }
      if (key === "stopLoop") return false;
    });
  }, [isReady]);

  const handleCreateMap = (map: Map) => {
    const maxId = Math.max(...maps.map((map: mapType) => +map.id), 0);
    const newMap = createMap(map, maxId + 1);
    if (newMap) {
      setMaps([...maps, newMap]);
      store.set(`story_${path[0]}_map_${newMap.id}`, newMap);
    }
  };

  return (
    <Fragment>
      <Box display="flex" p={0} gap={2} mb={4} alignItems="center">
        <Menu>
          <MenuButton as={Button}>Создать карту</MenuButton>
          <MenuList>
            <MenuItem onClick={() => handleCreateMap("CH4")}>Ч-4</MenuItem>
            <MenuItem onClick={() => handleCreateMap("ESCAPE")}>
              Кордон
            </MenuItem>
            <MenuItem onClick={() => handleCreateMap("AGROPROM")}>
              Агропром
            </MenuItem>
            <MenuItem onClick={() => handleCreateMap("GARBAGE")}>
              Свалка
            </MenuItem>
            <MenuItem onClick={() => handleCreateMap("DARK_VALLEY")}>
              Тёмная долина
            </MenuItem>
            <MenuItem onClick={() => handleCreateMap("BAR")}>Бар</MenuItem>
            <MenuItem onClick={() => handleCreateMap("ROSTOK")}>
              Дикая территория
            </MenuItem>
            <MenuItem onClick={() => handleCreateMap("MILITARY")}>
              Военные склады
            </MenuItem>
            <MenuItem onClick={() => handleCreateMap("RADAR")}>Радар</MenuItem>
          </MenuList>
        </Menu>
      </Box>
      <Box>
        <SimpleGrid columns={4} spacing={5}>
          {maps.map((map: mapType) => (
            <Link href={`/edit/map/${path[0]}/${map.id}`}>
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
                <Image
                  src={
                    map?.editor?.url
                      ? `/static/maps${map?.editor?.url}`
                      : `/static/maps/map_${map?.tmx?.split(".")[0]}.png`
                  }
                />
              </Card>
            </Link>
          ))}
        </SimpleGrid>
      </Box>
    </Fragment>
  );
};

export default MapScreen;
