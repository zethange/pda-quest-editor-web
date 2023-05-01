import React from "react";

import { useRouter } from "next/router";

import "reactflow/dist/style.css";

import StageScreen from "@/screens/stage/StageScreen";

export default function ChapterEditById() {
  const { query, isReady } = useRouter();
  const chapterRoute = (query.chapter as string[]) || [];

  return <StageScreen path={chapterRoute} query={query} isReady={isReady} />;
}
