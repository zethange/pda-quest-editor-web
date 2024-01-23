import Home from "@/pages/home";
import Story from "@/pages/story";
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
