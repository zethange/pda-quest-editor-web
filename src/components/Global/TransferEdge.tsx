import React, { FC, memo } from "react";
import { EdgeProps, getBezierPath, EdgeLabelRenderer } from "reactflow";
import { Badge, Box } from "@chakra-ui/react";

const TransferEdge: FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  label,
  data,
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  return (
    <>
      <path id={id} className="react-flow__edge-path" d={edgePath} />
      <EdgeLabelRenderer>
        {!!data.label && (
          <Box
            position="absolute"
            transform={`translate(-50%, -50%) translate(${labelX}px,${labelY}px)`}
            backgroundColor="#ffffff"
            _dark={{
              backgroundColor: "gray.900",
            }}
            p={1}
            fontSize="10px"
            borderRadius="5px"
            style={{
              pointerEvents: "all",
            }}
            cursor={"pointer"}
            className="nopan"
          >
            <Box>
              {data.label}
              {data.label.length === 30 && "..."}
              <Box display="grid" gap={1}>
                {data?.transfer?.condition &&
                  Object.keys(data?.transfer?.condition).length !== 0 && (
                    <>
                      {Object.entries(data.transfer.condition).map(
                        (condition: [string, unknown]) => {
                          return (condition[1] as string[]).map(
                            (condition: string) => (
                              <Badge key={condition} colorScheme="messenger">
                                {condition}
                              </Badge>
                            )
                          );
                        }
                      )}
                    </>
                  )}
              </Box>
            </Box>
            {label}
          </Box>
        )}
      </EdgeLabelRenderer>
    </>
  );
};

export default memo(TransferEdge);
