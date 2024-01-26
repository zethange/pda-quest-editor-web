import { FC } from "react";
import { Link } from "react-router-dom";
import { Card, Flex, Button, Text } from "@chakra-ui/react";
import { ChapterType } from "@/shared/lib/type/chapter.type";
import { ChapterEditDrawer, EditIdButton } from "@/features/chapter";
import { useChapterStore } from "@/entities/chapter";

export interface ChapterCardProps {
  chapter: ChapterType;
  storyId: number;
}

const ChapterCard: FC<ChapterCardProps> = ({ chapter, storyId }) => {
  const {} = useChapterStore();
  return (
    <Card variant="outline" key={chapter.id} p={2}>
      <Link to={`/edit/story/${storyId}/chapter/${chapter.id}`}>
        <Text>{!!chapter.title ? chapter.title : "Глава " + chapter.id}</Text>
      </Link>
      <Text fontSize="small" color="gray">
        id: {chapter.id}
      </Text>
      <Text>Кол-во стадий: {chapter.stages?.length}</Text>
      <Flex gap={2} w="100%">
        <Button
          size="sm"
          onClick={() => {
            const element = document.createElement("a");
            element.setAttribute(
              "href",
              "data:text/plain;charset=utf-8," +
                encodeURIComponent(JSON.stringify(chapter, null, 2))
            );
            element.setAttribute("download", `chapter_${chapter.id}.json`);

            element.style.display = "none";
            document.body.appendChild(element);

            element.click();

            document.body.removeChild(element);
          }}
        >
          Скачать
        </Button>
        <ChapterEditDrawer chapter={chapter} />
        <EditIdButton chapter={chapter} />
      </Flex>
    </Card>
  );
};

export { ChapterCard };
