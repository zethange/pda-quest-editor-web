import React, { useMemo } from "react";
import { Handle, Position } from "reactflow";
import { Badge, Box, Icon, SimpleGrid } from "@chakra-ui/react";
import { LGBTFlagColors } from "@/store/constants";
import { useAppSelector } from "@/store/reduxHooks";
import { GrNotification } from "react-icons/gr";

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
  notification?: boolean;
};

function NodeStage({
  data,
  isConnectable,
  selected,
}: {
  data: data;
  isConnectable: boolean;
  selected: boolean;
}) {
  const words = useMemo(() => data?.text, [data]);
  const settings = useAppSelector((state) => state.user.settings);
  const options = settings.danyaMod
    ? {
        background: `linear-gradient(to bottom, ${LGBTFlagColors.join(", ")})`,
        color: "white",
      }
    : {
        backgroundColor: selected ? "teal.200" : "white",
        color: "black",
        _dark: {
          color: "white",
          backgroundColor: selected ? "teal.500" : "gray.900",
        },
      };

  return (
    <Box
      p="8px"
      borderRadius={5}
      {...options}
      border={"1px solid"}
      borderColor="gray.800"
    >
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <button onClick={() => data.onClick()}>
        <Box textAlign="center">
          {data.label || "Стадия без названия"}{" "}
          {data.notification && <Icon pt="5px" as={GrNotification} />}
        </Box>
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
                      return (
                        <Badge colorScheme="green" key={param}>
                          {param}
                        </Badge>
                      );
                    } else if (action[0] === "remove") {
                      return (
                        <Badge colorScheme="red" key={param}>
                          {param}
                        </Badge>
                      );
                    } else if (action[0] === "money") {
                      return (
                        <Badge colorScheme="blue" key={param}>
                          ₽: {param}
                        </Badge>
                      );
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
              (condition: [string, string[]], index: number) => {
                return (
                  <SimpleGrid
                    columns={(condition[1] as string[]).length > 1 ? 2 : 1}
                    gap={1}
                    key={index}
                  >
                    {condition[1].map((param: string, index) => {
                      return (
                        <Badge colorScheme="orange" key={index}>
                          {condition[0]} {param}
                        </Badge>
                      );
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

export default NodeStage;
