import React, { useMemo } from "react";
import { Handle, Position } from "reactflow";
import { Badge, Box, SimpleGrid, Text } from "@chakra-ui/react";

type data = {
  label: string;
  onClick: () => void;
  text: string;
  actions: {
    [key: string]: string[];
  };
  condition?: {
    [key: string]: string[];
  };
  _comment?: string;
};

export function NodeStage({
  data,
  isConnectable,
  selected,
}: {
  data: data;
  isConnectable: any;
  selected: boolean;
}) {
  const words = useMemo(() => data?.text, [data]);

  return (
    <Box
      p="8px"
      borderRadius={5}
      backgroundColor={selected ? "teal.200" : "white"}
      _dark={{
        color: "white",
        backgroundColor: selected ? "teal.500" : "gray.900",
      }}
      border={"1px solid"}
      borderColor="gray.800"
      color="black"
    >
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <button onClick={() => data.onClick()}>
        <Text align="center">{data.label || "Стадия без названия"}</Text>
        <small>
          {words?.substring(0, 30)}
          {words?.length > 30 && "..."}
        </small>
        {data._comment && (
          <Box>
            <Badge fontSize="10px" colorScheme="gray">
              {"# " + data._comment.substring(0, 30) + "..."}
            </Badge>
          </Box>
        )}
        <Box display="grid" gap={1}>
          {Object.entries(data.actions).map(
            (action: [string, unknown], index: number) => {
              return (
                <SimpleGrid
                  columns={(action[1] as string[]).length > 1 ? 2 : 1}
                  gap={1}
                  key={index}
                >
                  {(action[1] as string[]).map((param: string) => {
                    if (action[0] === "add") {
                      return <Badge colorScheme="green">{param}</Badge>;
                    } else if (action[0] === "remove") {
                      return <Badge colorScheme="red">{param}</Badge>;
                    }
                  })}
                </SimpleGrid>
              );
            }
          )}
        </Box>
        {data.condition && (
          <Box display="grid" gap={1}>
            {Object.entries(data.condition).map(
              (condition: [string, unknown], index: number) => {
                return (
                  <SimpleGrid
                    columns={(condition[1] as string[]).length > 1 ? 2 : 1}
                    gap={1}
                    key={index}
                  >
                    {(condition[1] as string[]).map((param: string) => {
                      return <Badge colorScheme="messenger">{param}</Badge>;
                    })}
                  </SimpleGrid>
                );
              }
            )}
          </Box>
        )}
      </button>
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </Box>
  );
}
