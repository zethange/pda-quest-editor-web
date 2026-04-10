import * as querystring from "querystring";
import { ChapterEditorTabsWidget } from "@/widgets/chapter-editor-tabs";

interface StageScreenProps {
  path: string[];
  query: querystring.ParsedUrlQuery;
  isReady: boolean;
}

export default function StageScreen(props: StageScreenProps) {
  return <ChapterEditorTabsWidget {...props} />;
}
