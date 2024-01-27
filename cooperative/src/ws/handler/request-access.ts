import { ServerWebSocket } from "bun";
import { IGrantRequest, requests, stories, users } from "..";
import { IMessage } from "../type/request";
import { IResponse } from "../type/response";
import { v4 } from "uuid";

export const requestAccess = (
  message: IMessage,
  ws: ServerWebSocket<unknown>
): IResponse => {
  const { id } = message;
  const user = users.find((user) => user.id === id);

  const story = stories.find(
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

  const request = {
    id: v4(),
    storyId: story.id,
    userId: user?.id,
  } as IGrantRequest;

  requests.push(request);

  story.owner.session.send(
    JSON.stringify({
      type: "REQUEST_SHARE_STORY",
      requestShareStory: {
        data: request,
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
