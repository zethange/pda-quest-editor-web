import type { chapterType } from "@/store/types/story/chapterType";
import { buildChapterTree, type TreeNode } from "@/entities/chapter";

export const buildBinaryTree = buildChapterTree;

export const binaryTreeToChapterList = (node: TreeNode): chapterType[] => {
  const allChapters: chapterType[] = node.chapters;

  for (const childKey in node.children) {
    const childNode = node.children[childKey];
    const childChapters = binaryTreeToChapterList(childNode);
    allChapters.push(...childChapters);
  }

  return allChapters;
};
