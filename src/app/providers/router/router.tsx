import Home from "@/pages/story";
import Story from "@/pages/chapter";
import { createBrowserRouter } from "react-router-dom";
import ChapterEditor from "@/pages/chapter-editor/chapter-editor";

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
]);

export default router;
