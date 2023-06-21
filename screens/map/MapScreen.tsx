import React, { useEffect, useState } from "react";
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
import { mapApiType, mapType } from "@/store/types/mapType";
import Link from "next/link";
import { createMap } from "@/store/tools/mapTools";
import useFetching from "@/hooks/useFetching";

interface Props {
  path: string[];
  isReady: boolean;
}

const MapScreen = ({ path, isReady }: Props) => {
  const [maps, setMaps] = useState<mapType[]>([]);
  const { data, isLoading } = useFetching<mapApiType[]>(
    "/pdanetwork/api/v1/admin/quest/maps/all"
  );

  useEffect(() => {
    if (!isLoading) {
      store.each((key, value: mapType) => {
        if (key.includes(`story_${path[0]}_map`)) {
          const background = data?.find(
            (map) => +map.id === +value.id
          )?.background;
          console.log(key, value, maps);
          if (!value.editor) {
            value.editor = {};
            value.editor.url = `/${background}`;
          }
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
            <Link href={`/edit/map/${path[0]}/${map.id}`} key={map.id}>
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
                <Image src={`/static/maps${map?.editor?.url}`} />
              </Card>
            </Link>
          ))}
        </SimpleGrid>
      </Box>
    </>
  );
};

export default MapScreen;
