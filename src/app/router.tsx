import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "../../pages/index";
import StoryPage from "../../pages/edit/story/[storyId]";
import ChapterPage from "../../pages/edit/chapter/[...chapter]";
import ChapterMapPage from "../../pages/edit/chapter/maps/[...map]";
import NotFoundPage from "../../pages/404";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/edit/story/:storyId" element={<StoryPage />} />
      <Route path="/edit/chapter/:storyId/:chapterId" element={<ChapterPage />} />
      <Route path="/edit/chapter/:storyId/:chapterId/*" element={<ChapterPage />} />
      <Route
        path="/edit/chapter/maps/:storyId/:chapterId/:mapId"
        element={<ChapterMapPage />}
      />
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
