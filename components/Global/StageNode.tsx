import React, { useMemo } from "react";
import { Handle, Position } from "reactflow";
import { Badge, Box, Flex, Icon, SimpleGrid } from "@chakra-ui/react";
import { LGBTFlagColors } from "@/store/constants";
import { useAppSelector } from "@/store/reduxStore/reduxHooks";
import { GrNotification } from "react-icons/gr";
import { stageType } from "@/store/types/story/chapterType";
import { pointType } from "@/store/types/story/mapType";
import {
  AiOutlineArrowDown,
  AiOutlineArrowUp,
  AiOutlineWarning,
} from "react-icons/ai";

interface data {
  label: string;
  text: string;
  onClick: () => void;
  stage?: stageType;
  point?: pointType;
}

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

  const actions = data.stage?.actions || data.point?.actions;

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
        <Flex alignItems="center" justifyContent="center" gap={1}>
          {!data.stage?.background &&
            !data.point &&
            data.stage?.type_stage !== 4 && (
              <Icon fill="orange" as={AiOutlineWarning} />
            )}
          {data.label || "Стадия без названия"}{" "}
          {!!data.stage?.message && <Icon pt="5px" as={GrNotification} />}
          {!!actions &&
            Object.entries(actions).map((action) => {
              if (action[0] === "+")
                return action[1].map(() => (
                  <Icon fill="green" as={AiOutlineArrowUp} />
                ));
              if (action[0] === "-")
                return action[1].map(() => (
                  <Icon fill="red" as={AiOutlineArrowDown} />
                ));
            })}
        </Flex>
        <small>
          {words?.substring(0, 30)}
          {words?.length > 30 && "..."}
        </small>
        {data.stage?._comment && (
          <Box>
            <Badge fontSize="10px" colorScheme="gray">
              {"# " + data.stage?._comment.substring(0, 30) + "..."}
            </Badge>
          </Box>
        )}
        <Box display="grid" gap={1}>
          {!!actions &&
            Object.entries(actions).map(
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
        {!!data.point && data.point.condition && (
          <Box display="grid" gap={1}>
            {Object.entries(data.point.condition).map(
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
