import { chapterType } from "@/store/types/story/chapterType";

export interface TreeNode {
  path: string;
  children: {
    [key: string]: TreeNode;
  };
  chapters: chapterType[];
}

export function buildBinaryTree(chapters: chapterType[]): TreeNode {
  const rootNode: TreeNode = {
    path: "",
    children: {},
    chapters: [],
  };

  for (const chapter of chapters) {
    const pathParts = (chapter.catalog || "").split("/");
    let currentNode = rootNode;

    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i];

      const existingNode = Object.values(currentNode.children).find(
        (node: TreeNode) => {
          return node.path === part;
        }
      );

      if (part === "") {
        currentNode.chapters.push(chapter);
        continue;
      }

      if (existingNode) {
        currentNode = existingNode;
      } else {
        const path = currentNode.path ? `${currentNode.path}/${part}` : part;
        const newNode: TreeNode = {
          path,
          children: {},
          chapters: [],
        };
        currentNode.children[part] = newNode;
        currentNode = newNode;
      }

      if (pathParts.slice(0, i + 1).join("/") === chapter.catalog) {
        currentNode.chapters.push(chapter);
      }
    }
  }

  return rootNode;
}

export const binaryTreeToChapterList = (node: TreeNode): chapterType[] => {
  let allChapters: chapterType[] = node.chapters;

  for (const childKey in node.children) {
    const childNode = node.children[childKey];
    const childChapters = binaryTreeToChapterList(childNode);
    allChapters.push(...childChapters);
  }

  return allChapters;
};
