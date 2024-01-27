import { ServerWebSocket } from "bun";
import { IMessage } from "../type/request";
import { IResponse } from "../type/response";
import { IUserOnline, requests, stories, users } from "..";

export const answerRequest = (
  message: IMessage,
  ws: ServerWebSocket<unknown>
): IResponse => {
  const { id } = message;

  const request = requests.find(
    (request) => request.id === message.answerRequest?.id
  );

  if (!request) {
    return {
      type: "ANSWER_REQUEST",
      answerRequest: {
        ok: false,
        data: "Request not found",
      },
    };
  }

  const story = stories.find((story) => story.id === request.storyId);

  if (story?.owner.id !== id) {
    return {
      type: "ANSWER_REQUEST",
      answerRequest: {
        ok: false,
        data: "You can't answer this request",
      },
    };
  }

  const user = users.find((user) => user.id === request.userId);

  if (message.answerRequest?.allow) {
    story.editors.push(user as IUserOnline);

    user?.session.send(
      JSON.stringify({
        type: "ANSWER_REQUEST",
        answerRequest: {
          ok: true,
          allow: true,
          story: story.story,
          chapters: story.chapters,
        },
      } as IResponse)
    );
  } else {
    user?.session.send(
      JSON.stringify({
        type: "ANSWER_REQUEST",
        answerRequest: {
          ok: true,
          allow: false,
        },
      } as IResponse)
    );
  }
  requests.splice(requests.indexOf(request), 1);

  return {
    type: "NULL",
  };
};
