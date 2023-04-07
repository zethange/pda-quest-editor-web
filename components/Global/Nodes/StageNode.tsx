import React, { useMemo } from "react";
import { Handle, Position } from "reactflow";
import {Box, Text} from "@chakra-ui/react";

type data = {
  label: React.ReactNode;
  text: string;
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
  const words = useMemo(() => data?.text?.split(" "), [data]);
  return (
    <Box
      p="10px"
      borderRadius={5}
      backgroundColor={selected ? "hsl(212, 90%, 90%)" : "white"}
      border={"1px solid"}
      borderColor="gray.800"
      color="black"
    >
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <Text align="center">{data.label}</Text>
      <small>{words?.slice(0, 6).join(" ")}...</small>
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </Box>
  );
}
