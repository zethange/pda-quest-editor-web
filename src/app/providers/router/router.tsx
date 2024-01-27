import Home from "@/pages/story";
import Story from "@/pages/chapter";
import { createBrowserRouter } from "react-router-dom";
import ChapterEditor from "@/pages/chapter-editor/chapter-editor";
import UI from "@/pages/ui/ui";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/edit/story/:id",
    element: <Story />,
  },
  {
    path: "/edit/story/:storyId/chapter/:chapterId",
    element: <ChapterEditor />,
  },
  {
    path: "/ui",
    element: <UI />,
  },
]);

export default router;
