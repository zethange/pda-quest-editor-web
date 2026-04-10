import React from "react";
import { useLocation, useParams } from "react-router-dom";

import "reactflow/dist/style.css";

import StageScreen from "@/screens/StageScreen";

export default function ChapterEditById() {
  const location = useLocation();
  const { storyId, chapterId, "*": chapterRest } = useParams();
  const chapterRoute = [storyId, chapterId, chapterRest]
    .filter(Boolean)
    .map(String);
  const query = Object.fromEntries(new URLSearchParams(location.search).entries());

  return <StageScreen path={chapterRoute} query={query} isReady={true} />;
}
