import { ISharedStory, stories, users } from "..";
import { v4 } from "uuid";
import { IMessage } from "../type/request";
import { IResponse } from "../type/response";
import { ServerWebSocket } from "bun";

export const shareStory = (
  message: IMessage,
  ws: ServerWebSocket<unknown>
): IResponse => {
  const { id } = message;
  if (!message.shareStory) {
    return {
      type: "SHARE_STORY",
      shareStory: {
        ok: false,
        data: "Story not sent",
      },
    };
  }

  if (stories.some((story) => story.owner.id === id)) {
    return {
      type: "SHARE_STORY",
      shareStory: {
        ok: false,
        data: "Your can be share only one story",
      },
    };
  }

  const owner = users.find((owner) => owner.id === id);
  if (!owner) {
    return {
      type: "SHARE_STORY",
      shareStory: {
        ok: false,
        data: "Your not login",
      },
    };
  }

  const story: ISharedStory = {
    id: v4(),
    story: message.shareStory.story,
    chapters: message.shareStory.chapters,
    owner,
    editors: [owner],
  };

  stories.push(story);
  console.log(`Story ${story.id} shared`);

  return {
    type: "SHARE_STORY",
    shareStory: {
      ok: true,
      id: story.id,
    },
  };
};
