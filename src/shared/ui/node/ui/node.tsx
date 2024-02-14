import { StageType } from "@/shared/lib/type/chapter.type";
import { PointType } from "@/shared/lib/type/map.type";
import { Badge, Box, Flex, Icon, SimpleGrid } from "@chakra-ui/react";
import { FC, useMemo } from "react";
import {
  AiOutlineArrowDown,
  AiOutlineArrowUp,
  AiOutlineWarning,
} from "react-icons/ai";
import { GrNotification } from "react-icons/gr";
import { Handle, Position } from "reactflow";

interface IData {
  label: string;
  text: string;
  stage?: StageType;
  point?: PointType;
}

const Node: FC<{ data: IData; isConnectable: boolean; selected: boolean }> = ({
  data,
  isConnectable,
  selected,
}) => {
  const options = useMemo(() => {
    return {
      backgroundColor: selected ? "teal.200" : "white",
      color: "black",
      _dark: {
        color: "white",
        backgroundColor: selected ? "teal.500" : "gray.900",
      },
    };
  }, []);

  const actions = data.stage?.actions || data.point?.actions;
  const words = useMemo(() => data?.text, [data]);

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
      <button>
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
                return action[1].map((key) => (
                  <Icon key={key} fill="green" as={AiOutlineArrowUp} />
                ));
              if (action[0] === "-")
                return action[1].map((key) => (
                  <Icon key={key} fill="red" as={AiOutlineArrowDown} />
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
};

export { Node as StageNode };