import { useChapterStore } from "@/entities/chapter";
import { ChapterType } from "@/shared/lib/type/chapter.type";
import { Button } from "@chakra-ui/react";

const CreateChapterButton = () => {
  const { chapters, setChapters, storyId } = useChapterStore();

  const createChapter = () => {
    let id = Math.max(...chapters.map((chapter) => chapter.id)) + 1;
    if (id === -Infinity) id = 0;

    const newChapter: ChapterType = {
      id,
      title: `Глава ${id}`,
      stages: [],
      points: {},
      spawns: {},
      missions: [],
    };

    setChapters([...chapters, newChapter]);
    localStorage.setItem(
      `story_${storyId}_chapter_${id}`,
      JSON.stringify(newChapter)
    );
  };

  return (
    <Button fontWeight="normal" onClick={() => createChapter()}>
      Создать главу
    </Button>
  );
};

export { CreateChapterButton };
