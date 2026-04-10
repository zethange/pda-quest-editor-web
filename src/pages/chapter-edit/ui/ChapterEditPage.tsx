import { useLocation, useParams } from "react-router-dom";
import { ChapterEditorTabsWidget } from "@/widgets/chapter-editor-tabs";
import "@xyflow/react/dist/style.css";

export function ChapterEditPage() {
  const location = useLocation();
  const { storyId, chapterId, "*": chapterRest } = useParams();
  const chapterRoute = [storyId, chapterId, chapterRest]
    .filter(Boolean)
    .map(String);
  const query = Object.fromEntries(new URLSearchParams(location.search).entries());

  return <ChapterEditorTabsWidget path={chapterRoute} query={query} isReady={true} />;
}
