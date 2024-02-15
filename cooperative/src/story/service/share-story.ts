import { sessions, stories } from "../../database";
import { eventEmitter } from "../../echo";
import { ChapterType } from "../../type/chapter.type";
import { MapType } from "../../type/map.type";
import { StoryType } from "../../type/story.type";
import { v4 } from "uuid";
import { toStoryType } from "../model";

export const shareStory = (
  userId: string,
  story: StoryType & {
    chapters: ChapterType[];
    maps: MapType[];
  }
) => {
  const user = sessions.find((session) => session.id === userId);
  if (!user) {
    return {
      ok: false,
      msg: "Пользователь не найден",
    };
  }

  const id = v4();
  stories.push({
    ...story,
    localId: id,
    owner: user,
    editors: [user],
  });
  console.log(story);

  eventEmitter.emit(
    "data",
    JSON.stringify({
      type: "stories",
      stories: stories.map(toStoryType),
    })
  );

  return {
    ok: true,
    msg: `История успешно расшарена, ID: ${id}, через ID можно получить доступ к истории`,
    storyId: id,
  };
};
