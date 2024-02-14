import { ServerWebSocket } from "bun";
import { stories, users } from "..";
import { IMessage } from "../type/request";
import { IResponse } from "../type/response";

export const closeStory = (
  message: IMessage,
  ws: ServerWebSocket<unknown>
): IResponse => {
  const { id } = message;

  const story = stories.find((story) => story.id == message.closeStory?.id);

  if (!story) {
    return {
      type: "CLOSE_STORY",
      closeStory: {
        ok: false,
        data: "Story not found",
      },
    };
  }

  if (story.owner.id !== id) {
    return {
      type: "CLOSE_STORY",
      closeStory: {
        ok: false,
        data: "You can't close this story",
      },
    };
  }

  stories.splice(stories.indexOf(story), 1);
  console.log(`Story ${story.id} closed`);

  return {
    type: "CLOSE_STORY",
    closeStory: {
      ok: true,
      id: story.id,
    },
  };
};