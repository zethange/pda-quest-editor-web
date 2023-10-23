import { TreeNode } from "@/store/utils/storyUtils/buildBinaryTree";

const getNode = (path: string, folders: TreeNode) => {
  const pathParts = (path || "").split("/");
  const copyFolders: TreeNode = JSON.parse(JSON.stringify(folders));

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
};

const createNodeFolder = (pathNewFolder: string, folders: TreeNode) => {
  const path = (pathNewFolder || "").split("/");
  const copyFolders: TreeNode = JSON.parse(JSON.stringify(folders));

  console.log(path, pathNewFolder);
  if (path[0] === "") {
    const name =
      "Новая папка " + (Object.keys(copyFolders.children).length + 1);

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
  console.log(nodeNow);

  const name = "Новая папка " + (Object.keys(nodeNow.children).length + 1);
  path.push(name);
  nodeNow.children[name] = {
    path: path.join("/"),
    children: {},
    chapters: [],
  };
  return copyFolders;
};

export { getNode, createNodeFolder };
