import React, { useEffect } from "react";
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
import type { MapApi as mapApiType, MapEntity as mapType } from "@/entities/map";
import { Link } from "react-router-dom";
import useFetching from "@/hooks/useFetching";
import { useUnit } from "effector-react";
import { $maps, mapCreateRequested, mapDeleted, mapsPageOpened } from "@/features/map-list";

interface MapScreenWidgetProps {
  path: string[];
  isReady: boolean;
}

export function MapScreenWidget({ path, isReady }: MapScreenWidgetProps) {
  const [maps, openPage, createMapEvent, deleteMapEvent] = useUnit([
    $maps,
    mapsPageOpened,
    mapCreateRequested,
    mapDeleted,
  ]);
  const { data, isLoading } = useFetching<mapApiType[]>(
    "/pdanetwork/api/v1/admin/quest/maps/all"
  );

  useEffect(() => {
    if (!isReady || isLoading || !path[0]) return;
    openPage({ storyId: path[0] });
  }, [isReady, isLoading, path, openPage]);

  return (
    <>
      <Box display="flex" p={0} gap={2} mb={4} alignItems="center">
        <Menu>
          <MenuButton as={Button}>Создать карту</MenuButton>
          <MenuList>
            {data?.map((map) => (
              <MenuItem onClick={() => createMapEvent(map)} key={map?.id}>
                {map?.title}
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
                <Link to={`/edit/chapter/maps/${path[0]}/${path[1]}/${map.id}`}>
                  <Button colorScheme="teal">Редактировать</Button>
                </Link>
                <Button colorScheme="red" onClick={() => deleteMapEvent(+map.id)}>
                  Удалить
                </Button>
              </Flex>
            </Card>
          ))}
        </SimpleGrid>
      </Box>
    </>
  );
}
