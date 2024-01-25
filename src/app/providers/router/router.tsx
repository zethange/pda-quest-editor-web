import Home from "@/pages/story";
import Story from "@/pages/chapter";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/edit/story/:id",
    element: <Story />,
  },
]);

export default router;
