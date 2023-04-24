import React, { useEffect, useState } from "react";
import { Box, Card, Image, SimpleGrid } from "@chakra-ui/react";
import store from "store2";
import { mapType } from "@/store/types/mapType";
import Link from "next/link";

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

  return (
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
  );
};

export default MapScreen;
