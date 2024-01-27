import { ServerWebSocket } from "bun";
import { sharedStoryList, userOnlineList } from "..";
import { IMessage } from "../type/request";
import { IResponse } from "../type/response";

export const requestAccess = (
  message: IMessage,
  ws: ServerWebSocket<unknown>
): IResponse => {
  const { id } = message;
  const user = userOnlineList.find((user) => user.id === id);

  const story = sharedStoryList.find(
    (story) => story.id == message.requestAccess?.storyId
  );

  if (!story) {
    return {
      type: "REQUEST_ACCESS",
      requestAccess: {
        ok: false,
        data: "Story not found",
      },
    };
  }

  story.owner.session.send(
    JSON.stringify({
      type: "REQUEST_SHARE_STORY",
      requestShareStory: {
        storyId: story.id,
        userLogin: user?.login,
      },
    } as IResponse)
  );
  console.log(`User ${user?.login} requested access to story ${story.id}`);

  return {
    type: "REQUEST_ACCESS",
    requestAccess: {
      ok: true,
      data: "Sent request to access story",
    },
  };
};
