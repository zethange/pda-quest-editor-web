import { Navigate, Route, Routes } from "react-router-dom";
import { HomePage } from "@/pages/home";
import { StoryEditPage } from "@/pages/story-edit";
import { ChapterEditPage } from "@/pages/chapter-edit";
import { ChapterMapEditPage } from "@/pages/chapter-map-edit";
import { NotFoundPage } from "@/pages/not-found";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/edit/story/:storyId" element={<StoryEditPage />} />
      <Route path="/edit/chapter/:storyId/:chapterId" element={<ChapterEditPage />} />
      <Route path="/edit/chapter/:storyId/:chapterId/*" element={<ChapterEditPage />} />
      <Route
        path="/edit/chapter/maps/:storyId/:chapterId/:mapId"
        element={<ChapterMapEditPage />}
      />
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
