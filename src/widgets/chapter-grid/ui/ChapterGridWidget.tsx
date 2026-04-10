import { SimpleGrid } from "@chakra-ui/react";
import ChapterCard from "@/components/Story/ChapterCard/ChapterCard";
import type { Chapter } from "@/entities/chapter";

interface ChapterGridWidgetProps {
  storyId: string;
  chapters: Chapter[];
  onOpenChapter: (chapter: Chapter) => void;
  onOpenSettings: () => void;
}

export function ChapterGridWidget({
  storyId,
  chapters,
  onOpenChapter,
  onOpenSettings,
}: ChapterGridWidgetProps) {
  return (
    <SimpleGrid columns={5} spacing={2}>
      {chapters.map((chapter) => (
        <ChapterCard
          storyId={storyId}
          chapter={chapter}
          setOpenChapter={onOpenChapter}
          onOpen={onOpenSettings}
          key={chapter.id}
        />
      ))}
    </SimpleGrid>
  );
}
