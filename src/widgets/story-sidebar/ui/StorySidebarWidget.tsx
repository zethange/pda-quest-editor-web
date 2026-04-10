import StorySidebar from "@/components/Story/StorySidebar";
import type { TreeNode } from "@/entities/chapter";

interface StorySidebarWidgetProps {
  folders: TreeNode;
  storyId: string;
  createFolder: (path: string) => void;
}

export function StorySidebarWidget(props: StorySidebarWidgetProps) {
  return <StorySidebar {...props} />;
}
