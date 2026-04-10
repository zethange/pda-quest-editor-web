import type { chapterType } from "@/store/types/story/chapterType";

export interface TreeNode {
  path: string;
  children: Record<string, TreeNode>;
  chapters: chapterType[];
}

export function buildChapterTree(chapters: chapterType[]): TreeNode {
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
        (node) => node.path === part
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

export function getTreeNode(path: string, folders: TreeNode): TreeNode {
  const pathParts = (path || "").split("/");
  const copyFolders: TreeNode = JSON.parse(JSON.stringify(folders)) as TreeNode;

  if (pathParts[0] === "") {
    return folders;
  }

  let nodeNow: TreeNode = copyFolders;
  for (const part of pathParts) {
    if (part in nodeNow.children) {
      nodeNow = nodeNow.children[part];
    }
  }

  return nodeNow;
}

export function createTreeFolder(pathNewFolder: string, folders: TreeNode): TreeNode {
  const path = (pathNewFolder || "").split("/");
  const copyFolders: TreeNode = JSON.parse(JSON.stringify(folders)) as TreeNode;

  if (path[0] === "") {
    const name = `Новая папка ${Object.keys(copyFolders.children).length + 1}`;
    copyFolders.children[name] = {
      path: name,
      children: {},
      chapters: [],
    };
    return copyFolders;
  }

  let nodeNow: TreeNode = copyFolders;
  for (const part of path) {
    nodeNow = nodeNow.children[part];
  }
  const name = `Новая папка ${Object.keys(nodeNow.children).length + 1}`;
  path.push(name);
  nodeNow.children[name] = {
    path: path.join("/"),
    children: {},
    chapters: [],
  };
  return copyFolders;
}
