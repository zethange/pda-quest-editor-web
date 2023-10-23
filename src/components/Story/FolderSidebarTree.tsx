import { FC } from "react";
import { TreeNode } from "@/store/utils/storyUtils/buildBinaryTree";
import { Box, VStack } from "@chakra-ui/react";
import { FolderButton } from "@/components/Story/FolderButton";

interface Props {
  text: string;
  folder: TreeNode;
  createFolder: (path: string) => void;
  storyId: string;
}

const FolderSidebarTree: FC<Props> = ({
  text,
  folder,
  createFolder,
  storyId,
}) => {
  return (
    <Box w="100%">
      <FolderButton
        text={text}
        node={folder}
        createFolder={createFolder}
        storyId={storyId}
      >
        <VStack gap={1}>
          {Object.entries(folder.children).map((folder) => {
            return (
              <FolderSidebarTree
                createFolder={createFolder}
                key={folder[0]}
                text={folder[0]}
                storyId={storyId}
                folder={folder[1]}
              />
            );
          })}
        </VStack>
      </FolderButton>
    </Box>
  );
};

export default FolderSidebarTree;
