import { ISharedStory, sharedStoryList, userOnlineList } from "..";
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

  if (sharedStoryList.some((story) => story.owner.id === id)) {
    return {
      type: "SHARE_STORY",
      shareStory: {
        ok: false,
        data: "Your can be share only one story",
      },
    };
  }

  const owner = userOnlineList.find((owner) => owner.id === id);
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

  sharedStoryList.push(story);
  console.log(`Story ${story.id} shared`);

  return {
    type: "SHARE_STORY",
    shareStory: {
      ok: true,
      id: story.id,
    },
  };
};
