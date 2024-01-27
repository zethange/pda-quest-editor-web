import { ServerWebSocket } from "bun";
import { IMessage } from "../type/request";
import { IResponse } from "../type/response";
import { sharedStoryList } from "..";

export const getSharedStories = (
  message: IMessage,
  ws: ServerWebSocket<unknown>
): IResponse => {
  return {
    type: "SHARED_STORIES",
    sharedStories: sharedStoryList.map((story) => ({
      id: story.id,
      story: story.story,
      owner: {
        login: story.owner.login,
      },
    })),
  };
};
