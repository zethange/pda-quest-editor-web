import React, { FC } from "react";
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
        <Box
          position="absolute"
          transform={`translate(-50%, -50%) translate(${labelX}px,${labelY}px)`}
          backgroundColor="#ffffff"
          p={1}
          fontSize="10px"
          borderRadius="5px"
        >
          <Box>
            {data.label}
            <Box display="grid" gap={1}>
              {Object.keys(data.transfer.condition).length !== 0 && (
                <>
                  {Object.entries(data.transfer.condition).map(
                    (condition: any, conditionIndex: number) => (
                      <>
                        {condition[1].map((condition: string) => (
                          <Badge colorScheme="red">{condition}</Badge>
                        ))}
                      </>
                    )
                  )}
                </>
              )}
            </Box>
          </Box>
          {label}
        </Box>
      </EdgeLabelRenderer>
    </>
  );
};

export default TransferEdge;
