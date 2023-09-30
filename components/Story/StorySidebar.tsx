import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import { TreeNode } from "@/store/utils/storyUtils/buildBinaryTree";
import { FC } from "react";
import FolderSidebarTree from "@/components/Story/FolderSidebarTree";
import { FolderButton } from "@/components/Story/FolderButton";

interface Props {
  folders: TreeNode;
  storyId: string;
  createFolder: (path: string) => void;
}

const StorySidebar: FC<Props> = ({ storyId, folders, createFolder }) => {
  return (
    <Box
      p={2}
      display="grid"
      alignContent="baseline"
      gap={2}
      backgroundColor="blackAlpha.50"
      _dark={{
        backgroundColor: "gray.700",
      }}
      borderRadius="10px"
      h="100%"
    >
      <Flex>
        <Text>Папки:</Text>
      </Flex>
      <VStack gap={2}>
        <FolderButton
          storyId={storyId}
          createFolder={createFolder}
          node={{
            path: "",
            children: {},
            chapters: [],
          }}
          text={"История " + storyId}
        >
          <VStack gap={1}>
            {Object.entries(folders?.children || {}).map((folder) => {
              return (
                <FolderSidebarTree
                  storyId={storyId}
                  key={folder[0]}
                  text={folder[0]}
                  folder={folder[1]}
                  createFolder={createFolder}
                />
              );
            })}
          </VStack>
        </FolderButton>
      </VStack>
    </Box>
  );
};

export default StorySidebar;
