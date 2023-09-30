import { FC, ReactNode, useState } from "react";
import {
  Box,
  Flex,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { BiFolder, BiSolidFolderPlus } from "react-icons/bi";
import { useRouter } from "next/router";
import { AiOutlineArrowDown, AiOutlineArrowRight } from "react-icons/ai";
import { TreeNode } from "@/store/utils/storyUtils/buildBinaryTree";
import { VscDebugBreakpointLog } from "react-icons/vsc";
import { logger } from "@/store/utils/logger";
import { chapterType } from "@/store/types/story/chapterType";

interface Props {
  node: TreeNode;
  storyId: string;
  text: string;
  children?: ReactNode;
  isOpen?: boolean;
  createFolder: (path: string) => void;
}

export const FolderButton: FC<Props> = ({
  text,
  storyId,
  node,
  isOpen = false,
  children,
  createFolder,
}) => {
  const [isOpenState, setIsOpenState] = useState(isOpen);
  const { push, asPath } = useRouter();

  return (
    <Box
      w="100%"
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDrop={(e) => {
        const data: chapterType = JSON.parse(
          e.dataTransfer.getData("application/json")
        );
        data.catalog = node.path;
        localStorage.setItem(
          `story_${storyId}_chapter_${data.id}`,
          JSON.stringify(data)
        );

        e.preventDefault();
        e.stopPropagation();
        location.replace(`/edit/story/${storyId}?path=${node.path}`);
      }}
    >
      <Box
        p={1}
        rounded="10px"
        display="flex"
        gap={2}
        userSelect="none"
        w="100%"
        justifyContent="space-between"
        fontWeight="normal"
        bg="blackAlpha.50"
        _dark={{
          bg: "transparent",
          border: "1px solid",
          borderColor: "whiteAlpha.500",
        }}
      >
        <Flex
          gap={2}
          alignItems="center"
          cursor="pointer"
          onClick={() => {
            push(asPath.split("?")[0] + "?path=" + node.path);
            setIsOpenState(!isOpenState);
          }}
        >
          <Icon as={isOpenState ? AiOutlineArrowDown : AiOutlineArrowRight} />
          <Icon as={BiFolder} />
          {text}
        </Flex>
        <Menu>
          <MenuButton>
            <IconButton
              aria-label="Создать папку"
              as={VscDebugBreakpointLog}
              variant="ghost"
              size="xs"
            />
          </MenuButton>
          <MenuList>
            <MenuItem
              onClick={() => {
                logger.info(node.path);
                createFolder(node.path ? node.path : "");
              }}
            >
              Создать новую папку
            </MenuItem>
            <MenuItem disabled>Удалить папку</MenuItem>
          </MenuList>
        </Menu>
      </Box>

      {isOpenState && children && (
        <Box pl={2} pt={1}>
          {children}
        </Box>
      )}
    </Box>
  );
};
