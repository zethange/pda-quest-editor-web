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
import { createMap, MapsApiType } from "@/store/tools/mapTools";
import useFetching from "@/hooks/useFetching";

interface Props {
  path: string[];
  isReady: boolean;
}

const MapScreen = ({ path, isReady }: Props) => {
  const [maps, setMaps] = useState<mapType[]>([]);
  const { data } = useFetching<MapsApiType[]>(
    "/pdanetwork/api/v1/admin/quest/maps/all"
  );

  useEffect(() => {
    store.each((key, value) => {
      if (key.includes(`story_${path[0]}_map`)) {
        console.log(key, value, maps);
        setMaps((map: any) => [...map, value]);
      }
      if (key === "stopLoop") return false;
    });
  }, [isReady]);

  const handleCreateMap = (map: MapsApiType) => {
    const newMap = createMap(map);
    if (newMap) {
      setMaps([...maps, newMap]);
      store.set(`story_${path[0]}_map_${newMap.id}`, newMap);
    }
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
    </>
  );
};

export default MapScreen;
